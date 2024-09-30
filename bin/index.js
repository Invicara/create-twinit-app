#! /usr/bin/env node

const decompress = require('decompress')
const path = require('path')
const fs = require('fs')
const { read } = require('read')

const packageTemplate = require('./package.json')

let nameOptions = {prompt: "Twinit app name:", default: "my-twinit-react-client"}
read(nameOptions).then((appName) => {
   
   let descOptions = {prompt: "Twinit app description:", default: "My Twinit React Client Description"}
   read(descOptions).then((desc) => {

      let verOptions = {prompt: "Version:", default: "1.0.0"}
      read(verOptions).then((version) => {

         let authorOptions = {prompt: "Author:", default: "None"}
         read(authorOptions).then((author) => {

            let appidOptions = {prompt: "Application ID (required - default = dev-training):", default: "77b2cdca-c1a3-4d27-9d19-7b5358e3b337"}
            read(appidOptions).then((appId) => {

               let cfgUserTypeOptions = {prompt: "Config _userType: (required - default = dev-training):", default: "dev-train"}
               read(cfgUserTypeOptions).then((cfgtype) => {

                  let twinitOptions = {prompt: "Twinit API URL:", default: "https://sandbox-api.invicara.com"}
                  read(twinitOptions).then((url) => {

                     decompress(path.join(__dirname, 'starter-app-source.zip'), './', {strip: 1}).then(() => {
         
                        packageTemplate.name = appName.replaceAll(' ', '-').toLowerCase()
                        packageTemplate.description = desc
                        packageTemplate.version = version
                        packageTemplate.author = author
                        packageTemplate.type = "module"
         
                        fs.writeFileSync('./package.json', JSON.stringify(packageTemplate, null, 3))

                        fs.writeFileSync('./app/public/config.js', `const endPointConfig = {
                           itemServiceOrigin: '${url}',
                           passportServiceOrigin: '${url}',
                           fileServiceOrigin: '${url}',
                           datasourceServiceOrigin: '${url}',
                           graphicsServiceOrigin: '${url}',
                           baseRoot: 'http://localhost:8084',
                           applicationId: '${appId}'
                        }`)

                        fs.writeFileSync('./app/ipaCore/ipaConfig.js', `const ipaConfig = {
                           appName: "${appName}",
                           configUserType: "${cfgtype}",
                           applicationId: '${appId}',
                           scriptPlugins: [],
                           css: [],
                           redux: {
                           slices: []
                           },
                           components: {
                           dashboard: [],
                           entityData: [],
                           entityAction: []
                           }
                        }
                        
                           export default ipaConfig`)
                        })

                        console.log('--> New Twinit React Client App Setup Complete')
                        console.log('--> Run "npm install" to install node modules')
                        console.log('--> Run "npm run watch" to start local client')
                        console.log('--> Client will be served at http://localhost:8084')
                  })

               })

            })

         })

      })
   })
   
})




