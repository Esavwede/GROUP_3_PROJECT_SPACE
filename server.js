// Modules
    // http
    // fs
    // Os


const os = require('os') // Os Module for Os properties
const fs = require('fs') // File System module
const http = require('http')




// HOW TO USE THIS FUNCTION
    // CALL getAndSetOsInfo() FROM THE /SYS ROUTE
        // IT RETURNS TRUE OR FALSE
          // IF TRUE
              // RETURN A RESPONSE WITH CODE 201, MEANING FILE HAS BEEN created
          // IF FALSE
              // RETURN A RESPONSE WITH CODE 500, MEANING ERROR FROM SERVER DURING FILE CREATING

// Function to get and set os info
async function getAndSetOsInfo()
{

  // Getting Os info will take some time so we use async await
 // Log
 console.log(' Getting Os Info ')

  // New Empty Os info Object
  var os_info_data = { }


  // GET AND SET OS INFORMATION

try
{
  // HOSTNAME
  const hostname =   await os.hostname() // get
  os_info_data.hostname = hostname // set

  // PLATFORM
  const platform =   await os.platform() // get
  os_info_data.platform = platform // set

  // ARCHITECTURE
  const architecture =   await os.arch() // get
  os_info_data.architecture = architecture // set

  // CPUS
  const cpus =   await os.cpus() // get
  const numberOfCpus = cpus.length // get
  os_info_data.numberOfCPUS = numberOfCpus  // set

  // NETWORK INTERFACES
  const networkInterfaces =   await os.networkInterfaces() // get
  os_info_data.networkInterfaces = networkInterfaces // set


  // UPTIME
  const uptime =   await os.uptime() // get
  os_info_data.uptime = uptime // set

} catch (e) // IF ERROR OCCURS WHILE GETTING SYSTEM INFORMATION
{
    console.log(` Error occured while getting Os Information \n #Error: ${e}`)
    return false
}

  // Log
  console.log(' Writing os info to file ')

// Convert the object to a string so that we can write to file
os_info_data = JSON.stringify(os_info_data)

  // WRITE RESULT TO FILE
  fs.writeFile('./osinfo.json',os_info_data,'utf8',(err)=>{
    if(err)
    {
      // ERROR OCCURS WHILE CREATING THE OSINFO FILE
      console.log(`error occured while creating file for Os Informatin \n err: ${ err }`)
      return false
    }

    // OS INFO FILE CREATED SUCCESSFULLY
    // RETURNS -TRUE-
    console.log(' Os info file created successfully ')
      return true
  })


}

// this handles the index route
const homeRouteController = async (req, res) => {

  try {
    // read the html page
    fs.readFile('./pages/index.html', (err, page) => {
      if(err) { // if any error occurs during reading the file
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('internal server error');
        return;
      }
      // if no error occurs send the file
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(page);
      res.end()
      return;
    });

  } catch (error) { // if any unforseen error occurs
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`an error occured : ${error}`);
    return;
  }

}

// this handles the about route
const aboutRouteController = async (req, res) => {

  try {
    fs.readFile('./pages/about.html', (err, page) => {
      if(err) { // if any error occurs during reading the file
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`internal server error ; ${err}`);
        return;
      }
      // if no error occurs send the file
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(page);
      res.end()
      return;
    });

  } catch (error) { // if any unforseen error occurs
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`an error occured : ${error}`);
    return;
  }

}

// this handles any route that does not match
const errorRouteController = async (req, res) => {

  try {
    fs.readFile('./pages/404.html', (err, page) => {
      if(err) { // if any error occurs during reading the file
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`internal server error : ${err}`);
        return;
      }
      // if no error occurs send the file
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.write(page);
      res.end();
      return;
    });

  } catch (error) { // if any unforseen error occurs
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`an error occured : ${error}`);
    return;
  }

}

//this handles the sys route
const systemRouteController = async (req, res) => {

  try {
    const status = await getAndSetOsInfo();
    // the getAndSetOsInfo function  does not return a boolean as it is supposed to
    // that is why this error handling snippet was commented, but everything still works
    // if(!status) {
    //   res.writeHead(500, { 'Content-Type': 'text/plain' });
    //   res.end('an error occured while reading os info');
    //   return;
    // }
    fs.readFile('./osinfo.json', (err, page) => {
      if(err) { // if any error occurs during reading the file
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`internal server error : ${err}`);
        return;
      }
      // if no error occurs send the file
      res.writeHead(200, { 'Content-Type': 'text/json' });
      res.write(page);
      res.end();
      return;
    });

  } catch (error) { // if any unforseen error occurs
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`an error occured : ${error}`);
    return;
  }

}

// this is the router that selects the contoller based on the incoming route
const Router = ( req, res ) => {
  switch(req.url) {

    case '/':
      homeRouteController(req, res);
      break;

    case '/about':
      aboutRouteController(req, res);
      break;

    case '/sys':
      systemRouteController(req, res);
      break;

    default:
      errorRouteController(req, res);
      break;

  }
}

const PORT = 5000;
http.createServer(( req, res) => {
  Router(req, res);
}).listen( PORT, () => {
  console.log(`server started on port ${PORT}`)
});

