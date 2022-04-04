import React, {useContext,useState,useEffect, useRef} from 'react'
import { Text, View, StyleSheet } from 'react-native';
import { globContext } from '../../context/globContext';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices,
    registerGlobals,
  } from 'react-native-webrtc';



const VideoContainer = () => {
  const {auth:{user:{token,user_id}}} = useContext(globContext)
  const username = user_id
  const id = "13a13c87-b715-4781-8623-48518cf40e7c"
  const [localStream, setLocalStream] = useState(new MediaStream());
  const [remoteStream, setRemoteStream] = useState({toURL: () => {}});
  const [mapPeers,setMapPeers] = useState({})

  var ws = useRef(null)
  const urls = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',  
      }, {
        urls: 'stun:stun1.l.google.com:19302',    
      }, {
        urls: 'stun:stun2.l.google.com:19302',    
      }

    ],
  }
  const [hasRemote, setHasRemote] = useState(false)


  const signal = (user,action,message) => {
    const msg = {
      peer : user,
      action : action,
      message : message
  }
    console.log()
    ws.current.send(JSON.stringify(msg))
}

  console.log("video_init")
  console.log(token)
  console.log("remoteStream")
  console.log(remoteStream)
  console.log("-----------------------------------------------------")
  console.log("localStream")
  console.log(localStream)
  console.log("-----------------------------------------------------")

  

  const handlePeer = (peerUsername,receiver_channel_name)=> {
    console.log("VIDEO --- new peer -- ",peerUsername, " [",receiver_channel_name,"]")
  }


  const handleOffer = (sdp,peerUsername,receiver_channel_name) =>{
    console.log("VIDEO --- new offer -- ",peerUsername, " [",receiver_channel_name,"]\nOFFER SDP:",sdp,"\n------------------------------")
  }

  const handleAnswer = (sdp,peerUsername,receiver_channel_name) =>{
    console.log("VIDEO --- new answer",peerUsername, " [",receiver_channel_name,"]\nANSWER SDP:",sdp,"\n------------------------------")
  }


  useEffect(() => {
      ws.current = new WebSocket('ws://10.0.2.2:8000/video/'+id+'/?q='+token)
      ws.current.onopen = (e)=>{
          console.log("connection opened with signaling server",e)
          signal(username,'new-peer',{local_screen_sharing : false})
      }
      ws.current.onmessage = (msg) => {
          let data = JSON.parse(msg.data);
          console.log(data)
          const action =  data['action']
          const peerUsername = data['peer']
          console.log('peerUsername: ', peerUsername);
          console.log('action: ', action)
          if(peerUsername == username){ return;}

          const receiver_channel_name = data['message']['receiver_channel_name'];
          console.log('receiver_channel_name: ', receiver_channel_name);

          switch (action){
              case 'new-peer':
                  handlePeer(peerUsername,receiver_channel_name)
                  break;
              case 'new-offer':
                  handleOffer(data["message"]["sdp"],peerUsername,receiver_channel_name)
                  break;
              case 'new-answer':
                  handleAnswer(data["message"]["sdp"],peerUsername,receiver_channel_name)
                  break;
          }
          
      };

      ws.current.onclose = (e) =>{
          console.log('connection closed',e)
      }

      ws.current.onerror = (e) => {
          console.log('Error occured! ', e);
      }

      let isFront = false;
      mediaDevices.enumerateDevices().then(sourceInfos => {
        let videoSourceId;
        for (let i = 0; i < sourceInfos.length; i++) {
            const sourceInfo = sourceInfos[i];
            if (
            sourceInfo.kind == 'videoinput' &&
            sourceInfo.facing == (isFront ? 'front' : 'environment')
            ) {
                videoSourceId = sourceInfo.deviceId;
            }
        }
        mediaDevices.getUserMedia({
          audio: true,
          video: {
            mandatory: {
              minWidth: 500, // Provide your own width, height and frame rate here
              minHeight: 300,
              minFrameRate: 30,
            },
            facingMode: isFront ? 'user' : 'environment',
            optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
          },
        })
        .then(stream => {
          // Got stream!
          setLocalStream(stream);
          console.log("local stream set ", localStream)

        })
        .catch(error => {
          console.error('Error accessing media devices.', error);
        });
      }); 
  }, [])

 useEffect(()=>{
    console.log("REMOTE-STREAM-ADDED")
    console.log(remoteStream)
    if (remoteStream instanceof MediaStream)
      setHasRemote(true)
 },[remoteStream])

  return (
    <View>
            <View style={styles.videoContainer}>
        <View style={[styles.videos, styles.localVideos]}>
          <Text>Your Video</Text>
          <RTCView streamURL={localStream.toURL()} style={styles.localVideo} />
        </View>
        <View style={[styles.videos, styles.remoteVideos]}>
          <Text>Friends Video</Text>
          {hasRemote ? <RTCView streamURL={remoteStream.toURL()} style={styles.remoteVideo}/> : <Text>Waiting for partner to connect</Text>}
        </View>
      </View>
        </View>
  )

}



const Video = ({localStream,remoteStream}) => {
   
    
    return (
        <View>
            <View style={styles.videoContainer}>
        <View style={[styles.videos, styles.localVideos]}>
          <Text>Your Video</Text>
          <RTCView streamURL={localStream.toURL()} style={styles.localVideo} />
        </View>
        <View style={[styles.videos, styles.remoteVideos]}>
          <Text>Friends Video</Text>
          {hasRemote ? <RTCView streamURL={remoteStream.toURL()} style={styles.remoteVideo}/> : <Text>Waiting for partner to connect</Text>}
        </View>
      </View>
        </View>
    )
}


export default VideoContainer;



const styles = StyleSheet.create({
    root: {
      backgroundColor: '#fff',
      flex: 1,
      padding: 20,
    },
    inputField: {
      marginBottom: 10,
      flexDirection: 'column',
    },
    videoContainer: {
      flex: 1,
      minHeight: 450,
    },
    videos: {
      width: '100%',
      flex: 1,
      position: 'relative',
      overflow: 'hidden',
  
      borderRadius: 6,
    },
    localVideos: {
      height: 100,
      marginBottom: 10,
    },
    remoteVideos: {
      height: 400,
    },
    localVideo: {
      backgroundColor: '#f2f2f2',
      height: '100%',
      width: '100%',
    },
    remoteVideo: {
      backgroundColor: '#f2f2f2',
      height: '100%',
      width: '100%',
    },
  });