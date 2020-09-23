from flask import jsonify

from . import home
from ..models import Varinfo

@home.after_request
def cors(environ):
    environ.headers['Access-Control-Allow-Origin']='*'
    environ.headers['Access-Control-Allow-Method']='*'
    environ.headers['Access-Control-Allow-Headers']='x-requested-with,content-type'
    return environ

@home.route("/getvar/")
def get_varinfo():
    ret_json = []
    vars = Varinfo.query.all()
    for var in vars:
        var_info = {}
        var_info["id"] = var.id
        var_info["name"] = var.qualityParameterName
        var_info["type"] = var.varType
        ret_json.append(var_info)

    return jsonify(ret_json)