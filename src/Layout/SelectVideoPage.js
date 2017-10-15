import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Container, Form, Button, Input } from 'semantic-ui-react';
import axios from 'axios';

import { cApp } from '../utils';

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
        var ytUrl = this.state.ytUrl;
        fetch('http://52.206.8.179:5000/ytupload?url=' + ytUrl)
        .then(res => res.text())
        .then(parsedStr => {
            this.handleRawSubmit("http://52.206.8.179/videos/" + parsedStr);
        }).catch(e => console.log(e));
    }

    handleRawSubmit(submitUrl) {
        this.props.setUrl(submitUrl);
        this.props.nPage();

        console.log('video being submitted:', submitUrl);

        console.log(cApp);

        cApp.models.predict(Clarifai.GENERAL_MODEL,
            {url: submitUrl},
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
            <Container>
                <h4>Link Youtube Video</h4>
                <Form onSubmit={() => this.handleYoutubeSubmit()}>
                    <Form.Input
                        style={{ alignSelf: 'center' }}
                        iconPosition='left'
                        action={{ icon: 'youtube play' }}
                        placeholder='Paste Youtube Link'
                        onChange={e => this.setState({ytUrl: e.target.value})}
                        value = {this.state.ytUrl}
                    />
                </Form>
                <h3> OR</h3>
                <h4>Link Raw Video</h4>
                <Form onSubmit={() => this.handleRawSubmit(this.state.rawUrl)}>
                    <Form.Input
                        style={{ alignSelf: 'center' }}
                        iconPosition='left'
                        action={{ icon: 'file video outline' }}
                        placeholder='Paste Raw Link'
                        onChange={e => this.setState({rawUrl: e.target.value})}
                        value = {this.state.rawUrl}
                    />
                </Form>
                <h3> OR</h3>
                <h4>Upload Video</h4>


                <Form onSubmit={() => this.handleFileUpload()}>
                    <Form.Input className="fileInput"
                        type="file"
                        name="video"
                        onChange={(e) => this.handleFileUpload(e)}
                        action={{ icon: 'cloud upload' }}
                    />

                </Form>

            </Container>
        )
    }
}
