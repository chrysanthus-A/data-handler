import { LicenseInfo } from '@mui/x-license-pro';


const key = '2f506578cd5a5c73157bb0bb8574af4cTz04MzI2NixFPTE3MzgyOTc2NTIwMDAsUz1wcmVtaXVtLExNPXN1YnNjcmlwdGlvbixLVj0y'
async function setkey(key){
  LicenseInfo.setLicenseKey(key);

}
setkey(key)