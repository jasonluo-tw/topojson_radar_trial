import numpy as np
import matplotlib.pyplot as plt
import geojsoncontour
import json, os, sys, glob
from datetime import datetime, timedelta
import matplotlib as mpl

def dbz_colormap():
    nws_reflectivity_colors = [
    #"#646464", # ND
    #"#ccffff", # -30
    #"#cc99cc", # -25
    #"#996699", # -20
    #"#663366", # -15
    #"#cccc99", # -10
    #"#999966", # -5
    "#646464", # 0
    "#04e9e7", # 5
    "#019ff4", # 10
    "#0300f4", # 15
    "#02fd02", # 20
    "#01c501", # 25
    "#008e00", # 30
    "#fdf802", # 35
    "#e5bc00", # 40
    "#fd9500", # 45
    "#fd0000", # 50
    "#d40000", # 55
    "#bc0000", # 60
    "#f800fd", # 65
    "#9854c6", # 70
    #"#fdfdfd" # 75
    ]

    return mpl.colors.ListedColormap(nws_reflectivity_colors)

def read_bin_data(root_folder, date):
    folder = f"{root_folder}/base_{YYYY+MM+DD}_{HH+mm}"
    bin_files = sorted(glob.glob(f"{folder}/*.bin"))
    
    all_grid_data = []
    print(bin_files)
    for infile in bin_files:
        with open(infile, 'rb') as f:
            grid_data = np.fromfile(f, dtype='float32', sep='').reshape((-1, 401, 401))
    
        all_grid_data.append(grid_data)
    
    all_grid_data = np.concatenate(all_grid_data, axis=0)
    all_grid_data = np.where(all_grid_data <= 0.5, np.nan, all_grid_data)
    
    ## start_time, end_time, lons, lats
    with open(f"{folder}/info.json", 'r') as f:
        info = json.load(f)
    
    lons = info['lons']
    lats = info['lats']
    st = datetime.strptime(info['start_time'], '%Y%m%d_%H%M')
    et = datetime.strptime(info['end_time'], '%Y%m%d_%H%M')
    
    time_interval = int( (et-st).total_seconds() / ((all_grid_data.shape[0]-1)*60) )
    dates = [st + timedelta(minutes=i*time_interval) for i in range(all_grid_data.shape[0])]
    dates = [i.strftime("%Y%m%d%H%M") for i in dates]

    return lons, lats, all_grid_data, dates

# e.g. 20211102
#date = sys.argv[1] ## date
# base_20220520_1720
date = "202205201940"
YYYY = date[:4]
MM   = date[4:6]
DD   = date[6:8]
HH   = date[8:10]
mm   = date[10:12]

root_folder = '.'

lons, lats, all_grid_data, dates = read_bin_data(root_folder, date)

levs = np.arange(0, 64, 4)
## check folder
#outpath = '/home/amoeba/luo-j_eval/DL_SR_GSM_wind/data/tmp_contourf'
outpath = '../dist/vis_data'
outpath = f'{outpath}/{YYYY+MM+DD+HH+mm}'
if not os.path.exists(outpath):
    os.makedirs(outpath, exist_ok=True)

cmap = dbz_colormap()
## output 00-23 fcst time
for i in range(all_grid_data.shape[0]):
    #print(f'Make basetime:{YYYY+MM+DD+"00"} fcsttime:{HH} - radar data')
    tmpdata = all_grid_data[i, :, :]
    dd = dates[i]

    # Create a contour plot plot from grid (lat, lon) data
    figure = plt.figure()
    ax = figure.add_subplot(111)
    contourf = ax.contourf(lons, lats, tmpdata, levels=levs, cmap=cmap)

    #plt.savefig(f"{i:02d}.png", bbox_inches='tight')
    # Convert matplotlib contourf to geojson
    geojson = geojsoncontour.contourf_to_geojson(
        contourf = contourf,
        min_angle_deg = 0.0,
        ndigits = 10,
        stroke_width = 0,
        fill_opacity = 0.6
    )
    ## store geojson file
    with open(f'{outpath}/tmp.geojson', 'w') as f:
        f.write(geojson)
    
    plt.close()

    cmd = f'geo2topo {outpath}/tmp.geojson > {outpath}/{dd}.topojson'
    ## change geojson to topojson
    output = os.popen(cmd).read()


os.popen(f"rm -f {outpath}/tmp.geojson")
