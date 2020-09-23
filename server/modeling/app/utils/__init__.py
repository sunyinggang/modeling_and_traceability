from flask import Response, jsonify


# 定义response返回类,自动解析json
class JSONResponse(Response):
    @classmethod
    def force_type(cls, response, environ=None):
        if isinstance(response, dict):  # 判断返回类型是否是字典(JSON)
            response = jsonify(response)  # 转换
        return super().force_type(response, environ)