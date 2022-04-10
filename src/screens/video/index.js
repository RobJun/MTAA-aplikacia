import React, {useContext,useState,useEffect, useRef} from 'react'
import { Text, View, StyleSheet,FlatList,AppState } from 'react-native';
import {
    RTCPeerConnection,
    RTCView,
    MediaStream,
    mediaDevices,
  } from 'react-native-webrtc';
import { API_SERVER } from '../../api_calls/constants';
import CallButton from '../../components/callButton';

const urls = {
  iceServers: [
    {
      urls: 'stun:iphone-stun.strato-iphone.de:3478',  
    }, {
      urls: 'stun:stun.1und1.de:3478',    
    }, {
      urls: 'stun:stun.develz.org:3478',    
    }
  ],
}



const VideoContainer = ({route,navigation}) => {
  console.log(route)
  const {roomID,username,token} = route.params
  const [localStream, setLocalStream] = useState(new MediaStream());
  const [hasRemote, setHasRemote] = useState(false)
  const [hasLocal, setHasLocal] = useState(false)
  const peerConnections = {}
  const [peerConns,setPeerCons] = useState([])
  const [streams,setStreams] = useState({})
  const [isFront,setIsFront] = useState(true)
  var ws = useRef(null)
  const appstate = useRef(AppState.currentState)

  useEffect(()=>{
    const subscribe = AppState.addEventListener('change',(nextAppState)=>{
      if (
        appstate.current.match(/active/) &&
        (nextAppState === "inactive" || nextAppState ==  'background')
      ) {
        if(ws.current !== null){
          navigation.goBack()
        }
      }
    })
    return () => {
      subscribe.remove();
    };
  },[])

  useEffect(
    () => navigation.addListener('blur', () => {
      console.log("BLUR -- PEER CONS -- ",peerConns)
      peerConns.forEach(e=>{
        e.close()
      })
      //conn.close()
      ws.current.close()
    }),
    [navigation])


  useEffect(()=>{
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
            minWidth: 500,
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
        setHasLocal(true);
        console.log("local stream set ", localStream)

      })
      .catch(error => {
        console.error('Error accessing media devices.', error);
      });
    });
  },[])

  useEffect(() => {
    if(hasLocal){

      const signal = (user,action,message) => {
        const msg = {
          peer : user,
          action : action,
          message : message
        }
        ws.current.send(JSON.stringify(msg))
      }
    
      const handlePeer = (peerUsername,receiver_channel_name)=> {
        const conn = new RTCPeerConnection(null)
        peerConnections[peerUsername] = conn
        peerConns.push(conn)
        //console.log("PEEER CONNECTIONS : ", peerConnections, "length: ", Object.keys(peerConnections).length)
        //connections.push({user: peerUsername,conn:conn})
        //console.log("VIDEO --- new peer -- ",peerUsername, " [",receiver_channel_name,"]")
        conn.addStream(localStream)
         
        conn.onaddstream =(event)=>{
          //console.log("CONN.ONADDSTREAM- NEW PEER - adding stream")
          //streams[peerUsername] = event.stream
          setStreams((prev)=>{return {...prev,[peerUsername]: event.stream}})
        }

        conn.oniceconnectionstatechange = () => {
          var iceConnectionState = conn.iceConnectionState;
            if (iceConnectionState === "failed" || iceConnectionState === "disconnected" || iceConnectionState === "closed"){
                console.log('Deleting peer');
                //delete mapPeers[peerUsername];
                if(iceConnectionState != 'closed'){
                   conn.close();
                   //streams[peerUsername] = undefined
                   setStreams((prev) => {return {...prev,[peerUsername]: undefined}})
                  //setRemoteStream({toURL: ()=>{}})
                   //setHasRemote(false)
                }
            }
        }

        conn.onicecandidate = (event) => {
          if(event.candidate){
            //console.log("New Ice Candidate! Reprinting SDP")// + JSON.stringify(conn.localDescription));
            return;
          }
          //console.log('Gathering finished! Sending offer SDP to ', peerUsername, '.');
          //console.log('receiverChannelName: ', receiver_channel_name);

          signal(username,'new-offer', {
            sdp: conn.localDescription,
            receiver_channel_name: receiver_channel_name,
            local_screen_sharing: false,
            remote_screen_sharing: false,
          })
        }

        conn.createOffer()
            .then(o => conn.setLocalDescription(o))
            .then(e=>{console.log("local description set")})


      }
    
      const handleOffer = (sdp,peerUsername,receiver_channel_name) =>{
        //console.log("VIDEO --- new offer -- ",peerUsername, " [",receiver_channel_name,"]\n")//OFFER SDP:",sdp,"\n------------------------------")
        const conn = new RTCPeerConnection(null)
        peerConnections[peerConnections] = conn
        peerConns.push(conn)
        console.log(peerConns[peerConns.length - 1] === conn)
        //console.log("PEEER CONNECTIONS : ", peerConnections, "length: ", Object.keys(peerConnections).length)
        conn.addStream(localStream)
        conn.onaddstream = (event)=>{
          //console.log("CONN.ONADDSTREAM- NEW PEER - adding stream")
          //setRemoteStream(event.stream)
          console.log(event.stream)
          //streams[peerUsername] = event.stream
          setStreams((prev)=>{return {...prev,[peerUsername]: event.stream}})
        }

        conn.oniceconnectionstatechange = () => {
          var iceConnectionState = conn.iceConnectionState;
          console.log(iceConnectionState)
            if (iceConnectionState === "failed" || iceConnectionState === "disconnected" || iceConnectionState === "closed"){
                console.log('Deleting peer');
                //delete mapPeers[peerUsername];
                if(iceConnectionState != 'closed'){
                  conn.close();
                  //streams[peerUsername]=undefined
                  setStreams((prev) => {return {...prev,[peerUsername]: undefined}})
                  //setRemoteStream({toURL: ()=>{}})
                  //setHasRemote(false)
                }
            }
        }

        conn.onicecandidate = (event) => {
          if(event.candidate){
            //console.log("New Ice Candidate! Reprinting SDP")// + JSON.stringify(conn.localDescription));
            return;
          }
          //console.log('Gathering finished! Sending answer SDP to ', peerUsername, '.');
          //console.log('receiverChannelName: ', receiver_channel_name);
          
          signal(username,'new-answer', {
            sdp: conn.localDescription,
            receiver_channel_name: receiver_channel_name,
            local_screen_sharing: false,
            remote_screen_sharing: false,
        });
        }

        conn.setRemoteDescription(sdp).then(() => {
          console.log('Set offer from %s.', peerUsername);
          return conn.createAnswer();
      })
      .then(a => {
          console.log('Setting local answer for %s.', peerUsername);
          return conn.setLocalDescription(a);
      })
      .then(() => {
          console.log('Answer created for %s.', peerUsername);
          //console.log('localDescription: ', conn.localDescription);
          //console.log('remoteDescription: ', conn.remoteDescription);
      })
      .catch(error => {
          console.log('Error creating answer for %s.', peerUsername);
          console.log(error);
      });


      }
    
      const handleAnswer = (sdp,peerUsername,receiver_channel_name) =>{
        //console.log("VIDEO --- new answer",peerUsername, " [",receiver_channel_name,"]\n)")//ANSWER SDP:",sdp,"\n------------------------------")
        peerConnections[peerUsername].setRemoteDescription(sdp)
      }



      console.log('ws://'+API_SERVER+'/video/'+roomID+'/?q='+token)
      ws.current = new WebSocket('ws://'+API_SERVER+':8000/video/'+roomID+'/?q='+token)
      ws.current.onopen = (e)=>{
          console.log("connection opened with signaling server",e)
          signal(username,'new-peer',{local_screen_sharing : false})
      }
      ws.current.onmessage = (msg) => {
          let data = JSON.parse(msg.data);
          const action =  data['action']
          const peerUsername = data['peer']
          const receiver_channel_name = data['message']['receiver_channel_name'];
          console.log('--------- ON MESSAGE ------------')
          console.log('peerUsername: ', peerUsername);
          console.log('action: ', action)
          console.log('receiver_channel_name: ', receiver_channel_name);
          console.log('---------------------------------')
          if(peerUsername == username){ return;}

          switch (action){
              case 'new-peer':
                  console.log('---------- NEW PEER ------------')
                  handlePeer(peerUsername,receiver_channel_name)
                  console.log('--------------------------------')
                  break;
              case 'new-offer':
                  console.log('---------- NEW OFFER -----------')
                  handleOffer(data["message"]["sdp"],peerUsername,receiver_channel_name)
                  console.log('--------------------------------')
                  break;
              case 'new-answer':
                  console.log('---------- NEW ANSWER -----------')
                  handleAnswer(data["message"]["sdp"],peerUsername,receiver_channel_name)
                  console.log('--------------------------------')
                  break;
          }
          
      };

      ws.current.onclose = (e) =>{
          console.log('connection closed',e)
      }

      ws.current.onerror = (e) => {
          console.log('Error occured! ', e);
      } 
    }
  }, [hasLocal])

 useEffect(()=>{
    console.log("checking remote")
    if (Object.keys(streams).length>0){
      
      console.log(streams)
      //console.log("REMOTE-STREAM-ADDED")
      //console.log(remoteStream)
      setHasRemote(true)
    }else{
      console.log("No peers")
      setHasRemote(false)
    }
 },[streams])


 const renderItem = ({item})=>{
  console.log("THERE SHOULD BE TEXT NOW",item)
  console.log(streams)
  if(streams[item] === undefined) return;
  return(
    <View style={[styles.remoteVideoContainer]}>
      <Text>{item}</Text>
      <RTCView streamURL={streams[item].toURL()} style={[styles.localVideo,]} objectFit='contain' />
    </View>

    )
 }


 const [micOff,setMic] = useState(false) 
 const [videoOff,setVideoOff] = useState(false)

 return (
  <View style={{flex:1}}>
    <View>
      {hasRemote ? <FlatList
        data={Object.keys(streams)}
        extraData={streams}
        renderItem={renderItem}
        columnWrapperStyle={{justifyContent: "space-around"}}
        numColumns={2}
      
      />
       : <Text>Waiting for someone to connect</Text>}
    </View>
    <View style={styles.localVideoContainer}>
        <RTCView streamURL={localStream.toURL()} style={{flex:1}} objectFit='cover' />
    </View>
    <View style={{width:90,position:'absolute',bottom:0}}>
    <CallButton icon={'phone-hangup'} onPress={()=>{
        navigation.goBack()
    }} color='red'/>
    <CallButton icon={micOff ? 'microphone-off' : 'microphone'} onPress={()=>{
      setMic(prev => !prev)
      localStream.getAudioTracks()[0].enabled = !localStream.getAudioTracks()[0].enabled
      }}/>
    <CallButton icon={'camera-flip'} onPress={()=>{
      localStream.getVideoTracks().forEach((track)=>{
        track._switchCamera()
      })}
    }/>
    <CallButton icon={videoOff ? 'video-off' : 'video'} 
        onPress={()=>{
          console.log('here')
          setVideoOff(prev => !prev)
          console.log('here')
          localStream.getVideoTracks()[0].enabled= !localStream.getVideoTracks()[0].enabled
          console.log(localStream.getVideoTracks())
        }}/>
    </View>
  </View>
)

}

export default VideoContainer;

const styles = StyleSheet.create({
  localVideoContainer: {
    height:200,
    width:(220/16)*9,
    borderColor:'black',
    borderWidth:1,
    borderRadius:20,
    position: 'absolute',
    backgroundColor:'black',
    padding:0,
    overflow:'hidden',
    bottom:0,
    right:0,
    margin:10
  },
  localVideo : {
    height:'100%',
    width:'100%',

  },
  remoteVideoContainer : {
      height:200,
      width:200,
      backgroundColor: 'red',
  }
})