# coding=UTF-8
from app import db



class TmpVarinfo(db.Model):
    __tablename__ = "tmp_varinfo"  # 指明对应的数据库表名
    id = db.Column(db.Integer, primary_key=True)
    qualityParameterName = db.Column(db.String(255))
    varType = db.Column(db.String(255))
    disv = db.Column(db.Text)
    rel = db.Column(db.Text)
    dir = db.Column(db.Text)