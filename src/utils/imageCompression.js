import { Image } from 'react-native-compressor';
import RNFetchBlob from 'rn-fetch-blob'
import getPath from '@flyerhq/react-native-android-uri-path'
import DocumentPicker, { types } from 'react-native-document-picker';



export const pickImage = async (dispatch) =>{
    try {
        const response = await DocumentPicker.pick({
          presentationStyle: 'fullScreen',
          type: [types.images],
          allowMultiSelection:false
        });
        console.log(response[0].uri)
        dispatch(response[0]);
      } catch (err) {
        console.warn(err);
      }
}


export const compressImage = async (DocumentImage)=>{
    const result = await Image.compress(getPath(DocumentImage.uri),{
        compressionMethod: 'auto',
        quality:0.9,
        maxWidth:900,
        maxHeight:900
    })
    var stat;
    try {
    stat = await RNFetchBlob.fs.stat(result)
    } catch(e) {
        console.log('error')
    }
    const read = getPath(result)
    return {uri:read,name : DocumentImage.name,type : DocumentImage.type,size:stat.size}
}