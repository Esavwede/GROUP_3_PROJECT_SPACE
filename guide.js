/**
- ERROR HANDLING
- OPTIMIZATION
- MODULARITY/ REUSABLITY
- CREATE DESIGN DECISIONS FILE
*/



const http = require('http')  // HTTP MODULE FOR SERVER CREATION
const fs = require('fs')  // FILE SYSTEM MODULE FOR WORKING WITH FILES ON THE SERVER
const os = require('os') // OS MODULE FOR GETTING INFORMATION ABOUT THE OPERATING SYSTEM


// FUNCTION FOR GETTING AND SENDING HTML PAGES AS A  RESPONSE
// THIS TAKES
    // THE PATH OF THE FILE
    // THE ERROR MESSAGE YOU WANT TO  RETURN IF FETCHING THE FILE FAILED, e.g ERROR OCCURED WHILE GETTING INDEX PAGE
    // AND THE RESPONSE OBJECT, BASED ON THE OUTCOME OF THE FILE READING OPERATION, THE RESPONSE WILL BE SET AND sendHtmlPageResponse

function sendHtmlPageResponse(filePath,fileErrorMessage,res)
{

  fs.readFile(filePath,(err, data)=>{

    if(err)
    {
      console.log(fileErrorMessage)
      console.log(`err: ${ err }`)
      res.writeHead(500,{'Content-Type':'text/plain'})
      return res.end(' Error Occured while fetching page ')
    }

      res.writeHead(200,{'Content-Type':'text/html'})
      return res.end(data)

  })
}

// Function to get and set os info
async function getAndSetOsInfo()
{

 // Log
 console.log(' Getting Os Info ')

  // Os info Object
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


}
catch(err)
{
    console.log(` Error occured while getting os info \n #Error ${ err }`)
    return false
}

  // Log
  console.log(' Writing os info to file ')

// Convert to a string
os_info_data = JSON.stringify(os_info_data)

  // WRITE RESULT TO FILE
  fs.writeFile('./osinfo.json',os_info_data,'utf8',(err)=>{
    if(err) // ERROR DURING OS FILE CREATION
    {
      console.log(`error occured while creating file for Os Informatin \n err: ${ err }`)
      return false // RETURNS FALSE TO THE /SYS ROUTE
    }

    console.log(' Os info file created successfully ')
      return true // RETURNS TRUE TO THE /SYS ROUTE
  })


}



// Configs
const HOST = '127.0.0.1'
const PORT = 5000


// Server
const Server = http.createServer((req, res)=>{


    const urlPath = req.url


    if( urlPath === '/' )
    {
      // GET AND SEND HTML PAGE
      sendHtmlPageResponse('./pages/index.html',' Error Occured while fetching index page ',res)
    }
    else if( urlPath === '/about' )
    {
      sendHtmlPageResponse('./pages/about.html',' Error Occured while fetching about page ',res)
    }
    else if( urlPath === '/sys' )
    {

        const createdOsInfoFile = getAndSetOsInfo() // returns true if file created, returns false if not created

        if( createdOsInfoFile )
        {
          res.writeHead(201,{'Content-type':'text/plain'})
          return res.end('Your OS info has been saved successfully!')
        }

        res.writeHead(500,{'Content-type':'text/plain'})
        return res.end(' Error Occured while creating file ')

    }
    else
    {


      fs.readFile('./pages/404.html',(err, data)=>{

        if(err)
        {
          console.log(` error occured while fetching error page \n ${ err }`)
          res.writeHead(404,{'Content-Type':'text/html'})
        }

          res.writeHead(200,{'Content-Type':'text/html'})
          return res.end(data)

      })


    }



            // Error Listeners

            req.on('error',(err)=>{
                console.log(` error occured with request ${ err }`)
            })


            res.on('error',(err)=>{
              console.log(` error occured with response ${ err }`)
            })

})


Server.listen(PORT,HOST,()=>{
  console.log(` Server listening on port ${ PORT }`)
})
