import React, { Component } from 'react';
import { ZoomMtg } from "@zoomus/websdk";
import { TextField, Button, Card } from "@material-ui/core";
import './Zoomus.css';

const sys =  ZoomMtg.checkSystemRequirements();
console.log(sys);


const zoomMeeting = document.getElementById('zmmtg-root');

const API_KEY = 'm3O-XYAaQc-2s3wYsrx1Fw';

const API_SECRET = '5kt5usetgEXH3Da16FGhGaJfwet2oL9cWFIE';



class Zoomus extends Component {
   constructor(props) {
       super(props)
   
       this.state = {
            meetingLaunched: false,
            apiKey: API_KEY,
            apiSecret: API_SECRET,
            meetingNumber: '',
            userName: '',
            passWord: '',
            leaveUrl: 'http://device.letsving.com/zoom/build',
            role: 0    
        }
   }
   

    launchMeeting = () => {
        
        this.setState({ meetingLaunched: !this.state.meetingLaunched })
        const meetConfig = {
            meetingNumber: this.state.meetingNumber,
            passWord: this.state.passWord,
            userName: this.state.userName,
            apiKey: this.state.apiKey,
        
        }

        ZoomMtg.generateSignature({
            
            meetingNumber: this.state.meetingNumber,
            passWord: this.state.passWord,
            userName: this.state.userName,
            apiKey: this.state.apiKey,
            apiSecret: this.state.apiSecret,
            role: this.state.role,
            
            success (res)  {
                console.log('signature', res.result);
                ZoomMtg.init({
                    screenShare: false,
                    isSupportChat: false,
                    audioPanelAlwaysOpen: true,
                    leaveUrl: 'http://device.letsving.com/zoom/build',
                    success() {
                        ZoomMtg.join(
                            
                            {
                                meetingNumber: meetConfig.meetingNumber,
                                userName: meetConfig.userName,
                                signature: res.result,
                                apiKey: meetConfig.apiKey,
                                userEmail: '',
                                passWord: meetConfig.passWord,
                                success() {
                                    setTimeout(function() {
                                        var start = document.getElementById("pc-join");
                                        start.click();
                                    },3000);
                                    console.log('Meeting Joined');
                                },
                                error(res) {
                                    console.log(res);
                                }
                            }
                        );
                    },
                    error(res) {
                        console.log(res);
                    }
                });
            }
        });
    }
    
    componentDidMount() {
        ZoomMtg.setZoomJSLib("https://source.zoom.us/1.7.8/lib", "/av");
        ZoomMtg.preLoadWasm();
        ZoomMtg.prepareJssdk();
    }

    handleSpaceChange = (e) => {
        this.setState({ [e.target.name]: e.target.value.trim()})
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value})
    }

    render() {
        
        if (zoomMeeting != null) {
            zoomMeeting.style.height = '500px';
            zoomMeeting.style.width = '100px';
            zoomMeeting.style.position = 'relative';
            zoomMeeting.style.zIndex = '1';
            zoomMeeting.style.margin = '50%'
          }
        const { meetingLaunched, userName, meetingNumber, passWord } = this.state;
        return (
            <>
                {!meetingLaunched ?
                    <form className="form">
                        <TextField type="text" placeholder="Username" name="userName" value={userName} onChange={this.handleChange} />
                        <TextField required pattern=".\*S+.*" type="text" placeholder="Meeting Number" name="meetingNumber" value={meetingNumber} onChange={this.handleSpaceChange} />
                        <TextField type="text" placeholder="Password" name="passWord" value={passWord} onChange={this.handleSpaceChange} />

                        <Button variant="contained" color="primary" className="launchButton" onClick={this.launchMeeting}>Launch Meeting</Button>
                    </form> 
                :   
                    <></>
                }
            </>
        )
    }
}

export default Zoomus;