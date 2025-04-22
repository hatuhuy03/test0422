# # build website

# from flask import Flask, request, render_template
# import numpy as np
# import pandas as pd
# from sklearn import metrics 
# import warnings
# import pickle
# warnings.filterwarnings('ignore')
# from feature import FeatureExtraction

# file = open("pickle/model.pkl","rb")
# gbc = pickle.load(file)
# file.close()


# app = Flask(__name__)

# @app.route("/", methods=["GET", "POST"])
# def index():
#     if request.method == "POST":

#         url = request.form["url"]
#         obj = FeatureExtraction(url)
#         x = np.array(obj.getFeaturesList()).reshape(1,30) 

#         y_pred =gbc.predict(x)[0]
#         #1 is safe       
#         #-1 is unsafe
#         y_pro_phishing = gbc.predict_proba(x)[0,0]
#         y_pro_non_phishing = gbc.predict_proba(x)[0,1]
#         # if(y_pred ==1 ):
#         pred = "It is {0:.2f} % safe to go ".format(y_pro_phishing*100)
#         return render_template('index.html',xx =round(y_pro_non_phishing,2),url=url )
#     return render_template("index.html", xx =-1)


# if __name__ == "__main__":
#     app.run(debug=True)


# Build extension

from flask import Flask, request, jsonify
import numpy as np
import pickle
from feature import FeatureExtraction
from flask_cors import CORS 

with open("pickle/model.pkl", "rb") as file:
    gbc = pickle.load(file)

app = Flask(__name__)
CORS(app) 
feature_names = [
    "UsingIp", "longUrl", "shortUrl", "symbol", "redirecting",
    "prefixSuffix", "SubDomains", "Hppts", "DomainRegLen", "Favicon",
    "NonStdPort", "HTTPSDomainURL", "RequestURL", "AnchorURL", "LinksInScriptTags",
    "ServerFormHandler", "InfoEmail", "AbnormalURL", "WebsiteForwarding", "StatusBarCust",
    "DisableRightClick", "UsingPopupWindow", "IframeRedirection", "AgeofDomain", "DNSRecording",
    "WebsiteTraffic", "PageRank", "GoogleIndex", "LinksPointingToPage", "StatsReport"
]
@app.route("/check_url", methods=["POST"])
def check_url():
    try:
        data = request.get_json()
        url = data.get("url")

        if not url:
            return jsonify({"error": "No URL provided"}), 400

        
        obj = FeatureExtraction(url)
        features = obj.getFeaturesList()
        x = np.array(obj.getFeaturesList()).reshape(1,30)  
        features_dict = dict(zip(feature_names, features))
       
        y_pred = int(gbc.predict(x)[0])
        y_pro_phishing = float(gbc.predict_proba(x)[0, 0])
        y_pro_non_phishing = float(gbc.predict_proba(x)[0, 1])

        print(f"URL: {url}")
        print(f"Prediction: {y_pred}, Phishing: {y_pro_phishing}, Non-Phishing: {y_pro_non_phishing}")
        print("Features (key-value):")
        for key, value in features_dict.items():
            print(f"  {key}: {value}")

        return jsonify({
            "url": url,
            "x": y_pro_non_phishing,
            "prediction": y_pred,
            "phishing": y_pred == -1,
            "features": features_dict
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)

