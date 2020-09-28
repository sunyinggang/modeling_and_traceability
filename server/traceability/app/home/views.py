# coding=UTF-8
import json

import yaml
from flask import jsonify, request
from pip._vendor import requests

from . import home
from .. import app
from ..utils.trace_tool import listtodict, getdict_x, transtoChinese
from ..utils import graph_data, findfault_tool

# with open(app.config['STATIC_DIR']+'/data/ret1_1.json') as f:
#     cond = yaml.safe_load(f)

@home.after_request
def cors(environ):
    environ.headers['Access-Control-Allow-Origin'] = '*'
    environ.headers['Access-Control-Allow-Method'] = '*'
    environ.headers['Access-Control-Allow-Headers'] = 'x-requested-with,content-type'
    return environ

# step1:获取系统预设的X指标与Y指标
@home.route("/tracegraph/", methods=['POST'])
def get_traceGraph():
    ret = request.get_json()
    dic_rest_y = listtodict(ret)  # 存y的故障
    dic_x = getdict_x(ret)  # 存x对应的故障
    dic_y = dic_rest_y[0]  # 发生故障的y
    rest_y = dic_rest_y[1]  # 未发生故障的y
    # print(dic_y)
    # 构图
    r = requests.get("http://127.0.0.1:5000/model/use-model")
    cond = yaml.safe_load(r.text)
    graph = graph_data.out(cond, dic_x, dic_y, rest_y)
    graph_res = transtoChinese(graph)
    return graph_res

@home.route("/monitoring/")
def getmonitor():
    ret=findfault_tool.read_txt()
    return ret
