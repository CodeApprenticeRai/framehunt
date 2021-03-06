import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Container, Form, Button, Input } from 'semantic-ui-react';

import { makeAPIRequest, cApp } from '../utils';

import Clarifai from 'clarifai';



export default class SelectVideoPage extends Component {
    static propTypes = {
        nextPage: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this.state = {
            rawUrl: "",
            ytUrl:"",
            file: null,
        };

    }

    handleYoutubeSubmit() {
        //tommy's youtube magic here
        // use this.state.ytUrl
        alert("tommy do your thang");
    }

    handleRawSubmit() {
        console.log('SVP:', this.state.rawUrl);
        this.props.setUrl(this.state.rawUrl);
        this.props.nPage();
        const rawUrl = this.state.rawUrl;

        console.log('video being submitted:', rawUrl);

        console.log(cApp);

        cApp.models.predict(Clarifai.GENERAL_MODEL,
            {url: rawUrl},
            { video: true })
        .then(e => {
            this.props.nPage();
            this.props.setResponse(e);

            console.log(e);
        })
            .catch(e => {
                alert('We were not able to parse your video!', e);
                this.props.setPage(0);
            });
    }

    handleFileUpload(e) {
        console.log('uploaded:');

        var data = new FormData()
        data.append('video', e.target.files[0])
        this.props.nPage();
        fetch('/upload', {
            method: 'POST',
            body: data
        }).then(e => {
            this.props.nPage();
            // makeAPIRequest()
            console.log('upload post result: ', e);
        }).catch(e => {
            alert('We were not able to parse your video!', e);
            this.props.setPage(0);
        });


        console.log(e);
    }

    render() {
        return (
            <Container className="left">
                <h3>LINK YOUTUBE VIDEO</h3>
                <Form onSubmit={() => this.handleYoutubeSubmit()}>
                    <Form.Input
                        style={{ alignSelf: 'center' }}
                        iconPosition='left'
                        action={{ icon: 'youtube play' }}
                        placeholder='Paste YouTube video link.'
                        onChange={e => this.setState({ytUrl: e.target.value})}
                        value = {this.state.ytUrl}
                    />
                </Form>
                <h3>LINK RAW VIDEO</h3>
                <Form onSubmit={() => this.handleRawSubmit()}>
                    <Form.Input
                        style={{ alignSelf: 'center' }}
                        iconPosition='left'
                        action={{ icon: 'file video outline' }}
                        placeholder='Paste raw video link.'
                        onChange={e => this.setState({rawUrl: e.target.value})}
                        value = {this.state.rawUrl}
                    />
                </Form>
                <h3>UPLOAD VIDEO</h3>

                <Form onSubmit={() => this.handleFileUpload()}>
                    <Form.Input className="fileInput"
                        type="file"
                        name="video"
                        onChange={(e) => this.handleFileUpload(e)}
                        action={{ icon: 'cloud upload' }}
                    />

                </Form>

            </Container>
        );
    }
}
