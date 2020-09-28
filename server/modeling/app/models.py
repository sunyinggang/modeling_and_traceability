from app import db


class Varinfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    qualityParameterName = db.Column(db.String(255))
    varType = db.Column(db.String(255))

class TmpVarinfo(db.Model):
    __tablename__ = "tmp_varinfo"  # 指明对应的数据库表名
    id = db.Column(db.Integer, primary_key=True)
    qualityParameterName = db.Column(db.String(255))
    varType = db.Column(db.String(255))
    disv = db.Column(db.Text)
    rel = db.Column(db.Text)
    dir = db.Column(db.Text)

class Gq(db.Model):
    qualityParameterName = db.Column(db.String(255), primary_key=True)
    dataType = db.Column(db.String(255))
    lowerBoundValue = db.Column(db.Float)
    upperBoundValue = db.Column(db.Float)
    unit = db.Column(db.Text)
    dir = db.Column(db.Text)
    cyz = db.Column(db.Text)

class Value(db.Model):
    qualityParameterName = db.Column(db.String(255), primary_key=True)
    operator = db.Column(db.String(255))
    evalue = db.Column(db.Float)
    unit = db.Column(db.String(255))
    rating = db.Column(db.Text)
    cyz = db.Column(db.Text)

class GqGq(db.Model):
    __tablename__ = "gq_gq"  # 指明对应的数据库表名
    qualityParameterNameRow = db.Column(db.String(255), primary_key=True)
    qualityParameterNameRank = db.Column(db.String(255))
    valueQualityType = db.Column(db.String(255))
    bvalue = db.Column(db.Float)

class VGq(db.Model):
    __tablename__ = "v_gq"  # 指明对应的数据库表名
    id = db.Column(db.Integer, primary_key=True)
    qualityParameterNameRow = db.Column(db.String(255))
    qualityParameterNameRank = db.Column(db.String(255))
    valueQualityType = db.Column(db.String(255))
    bvalue = db.Column(db.Float)



