// Modules
    // http
    // fs
    // Os


const os = require('os') // Os Module for Os properties
const fs = require('fs') // File System module
const http = require('http')
const { Console } = require('console');
const { isAbsolute } = require('path');

const port = 3000;

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

const server = http.createServer((request, response) => {
  // Console.log any error that occurs when the request was made
  request.on('error', (err) => {
    console.log('An error ocurred')
  })

  // Console.log any error that occurs when the response was made
  response.on('error', (err) => {
    console.log('An error ocurred')
  })

  // set request.url to const urlPath for fast access
  const urlPath = request.url

  // Check if the urlPath == '/'. If true, load the index.html page
  if (urlPath == '/')
  {
    response.writeHead(200, {'Content-Type': 'text/html'})
    const data = fs.readFileSync('./pages/index.html')

    response.write(data)
    response.end()
  }

  // Else check if urlPath == '/about.html'. If true, load the about.html page
  else if (urlPath == '/about')
  {
    response.writeHead(200, {'Content-Type': 'text/html'})
    const data = fs.readFileSync('./pages/about.html')

    response.write(data)
    response.end()
  }

  // Else check if urlPath == '/sys'. If true, load the your os info has been saved successfully back to the user
  else if (urlPath == '/sys')
  {
    response.writeHead(201, {'Content-Type': 'text/plain'})

    response.write('Your os info has been saved successfully')
    getAndSetOsInfo()
    response.end()
  }

  // Else, load the 404.html page
  else
  {
    response.writeHead(404, {'Content-Type': 'text/html'})
    const data = fs.readFileSync('./pages/404.html')

    response.write(data)
    response.end()
  }

})


server.listen(port, () => {
  console.log(`This server is listening at port:${port}`)
})
