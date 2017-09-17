# BOSSA Platform

a [Sails](http://sailsjs.org) application

Running on https://api.iitrtclab.com

- When installed in a new machine, remember to install all the dependencies from package.json. You can install them manually one by one or you can do it automatically with the command: $ npm install

- This code is a copy of the BOSSA Platform's code, which I developed in a private repository in the IIT Real-Time Communications Lab, in the context of the NG911 Indoor Location Project. In order to make the Platform public, critical files have been configured to be ignored by git. In order to clone and run the webapp you need to include config.js and connection.js in /config, with the information and credentials for the databases.

BOSSA is integrated in the Indoor Location System (IIT RTC Lab) as a central platform that serves the components of the system, and allows external developers to access the system’s resources through the use of APIs.
With the inclusion of second-generation beacons, which integrate temperature and humidity sensors, the Indoor Location System increases its scope. In order to study the new possibilities, BOSSA provides support to the sensors array. In addition, the platform performs the role of Location Server for the Indoor Location System, serves tools for maintenance and test, and acts as intermediary between the database and the rest of the system. Furthermore, the project aims to promote modularity and independence between processes, and standardizes operations and internal interactions. Finally, BOSSA offers an environment for online publication of documentation and other resources concerning the project.
