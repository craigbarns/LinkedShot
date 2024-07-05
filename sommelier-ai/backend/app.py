from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
import pandas as pd
from models.recommendation import get_wine_recommendations

app = Flask(__name__)
api = Api(app)
CORS(app)

class WineRecommendation(Resource):
    def post(self):
        data = request.json
        recommendations = get_wine_recommendations(data)
        return jsonify(recommendations)

api.add_resource(WineRecommendation, '/recommend')

if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, request, jsonify
from flask_restful import Api, Resource
from flask_cors import CORS
import pandas as pd
from models.recommendation import get_wine_recommendations

app = Flask(__name__)
api = Api(app)
CORS(app)

class WineRecommendation(Resource):
    def post(self):
        data = request.json
        recommendations = get_wine_recommendations(data)
        return jsonify(recommendations)

api.add_resource(WineRecommendation, '/recommend')

if __name__ == '__main__':
    app.run(debug=True)
