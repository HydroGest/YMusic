# YMusic
A comfortable music client, based on Material Design 3.

## Deployment

 Python 3 is required in deploying YMusic.

### Create an environment

```shell
python3 -m venv venv #Linux&MacOS
py -3 -m venv .venv #Windows
```

### Activate the environment

Before you work on your project, activate the corresponding environment:

```shell
. .venv/bin/activate #Linux&MacOS
.venv\Scripts\activate #Windows
```

### Install requirements

```shell
pip install requirements.txt -r
```

### Start!

```shell
flask run
```

This launches a very simple builtin server, which is good enough for testing but probably not what you want to use in production.

Now head over to http://127.0.0.1:5000/, and you should see your hello world greeting.
