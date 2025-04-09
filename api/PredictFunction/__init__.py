import logging
import azure.functions as func
import json
import mlflow
from azureml.core import Workspace

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    try:
        req_body = req.get_json()
        
        # Get workspace
        ws = Workspace.from_config()
        
        # Get the model
        model_name = "azureml_credit-default-training-v8_output_mlflow_log_model_425387512"
        model = mlflow.sklearn.load_model(model_name)
        
        # Prepare input data
        input_data = [[
            req_body['LIMIT_BAL'],
            req_body['AGE'],
            req_body['BILL_AMT1'],
            req_body['PAY_AMT1']
        ]]
        
        # Make prediction
        prediction = model.predict(input_data)[0]
        probability = model.predict_proba(input_data)[0][1]  # Probability of class 1 (default)
        
        return func.HttpResponse(
            json.dumps({
                "prediction": int(prediction),
                "probability": float(probability)
            }),
            mimetype="application/json"
        )
        
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        return func.HttpResponse(
            json.dumps({"error": str(e)}),
            status_code=500,
            mimetype="application/json"
        )
