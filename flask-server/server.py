from flask import Flask

app = Flask(__name__)

@app.route("/members")
def members():
    # Convert set to list
    return {"members": list({"Berja", "Francisco", "Leopando", "Tayam"})}

if __name__ == "__main__":
    app.run(debug=True)
