import { LicenseInfo } from '@mui/x-license-pro';

// require('dotenv').config


const key = import.meta.env.VITE_muiKey
console.log(key)
async function setkey(key){
  LicenseInfo.setLicenseKey(key);

}
setkey(key)