# MCT TeamProject CO<sub>2</sub> Backend

## Features

 - Highly expandable/modular design
 - Uses modern services (MongoDB, Redis and InfluxDB)
 - Scalable by design (multiprocessing / vertically scalable)

## Documentation

You can view the documentation of the backend implementation and modularity in the dedicated [documentation repo](https://github.com/MCT-TeamProject-CO2/Documentation/tree/main/Node-Server).

## Deployment

Deployment is really easy with a few commands you can have the entire backend running (this is excluding that you still need to setup the databases required for this server).

Rename `auth.example.js` to `auth.js` and fill in the fields state in the file.
For a more in-depth explanation of these files go to the documentation repo.

```bash
git clone git@github.com:MCT-TeamProject-CO2/Node-Server.git

cd Node-Server

# modify the auth.js and docker-compose.yml files accordingly to match your environment
docker-compose up --build -d
```


## Notes

Technically this solution can be deployed horizontally but would require changes to the docker files. Redis is used to keep sessions syncronized between child processes.

Because this backend is just a REST API, the only protocol exposed is HTTP.
To properly deploy this solution you would proxy it through Nginx or Apache and add HTTPS through that.