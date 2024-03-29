import React from "react";
import { Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Button, Modal, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);

function RenderCampsite({ campsite }) {
    return (
        <div className="col-md-5 m-1">
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                    <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        </div>
    );
}

function RenderComments({ comments, postComment, campsiteId }) {

    if (comments) {

        return (
            <React.Fragment>
                <div className="col-md-5 m-1">
                    <h4>Comments</h4>

                    <Stagger in>
                        {
                            comments.map(comment => {
                                return (
                                    <Fade in key={comment.id}>
                                        <div>
                                            <p>
                                                {comment.text}<br />
                                            -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(Date.parse(comment.date)))}
                                            </p>
                                        </div>
                                    </Fade>
                                );
                            })
                        }
                    </Stagger>
                    <CommentForm campsiteId={campsiteId} postComment={postComment} />
                </div>

            </React.Fragment>

        );
    } else {
        return <div>No comments available</div>;
    }
}

function CampsiteInfo(props) {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }
    if (props.campsite) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <h2>{props.campsite.name}</h2>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderCampsite campsite={props.campsite} />
                    <RenderComments
                        comments={props.comments}
                        postComment={props.postComment}
                        campsiteId={props.campsite.id}
                    />
                </div>
            </div>
        );
    } else {
        return <div>Select a campsite.</div>;
    }
}

class CommentForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rating: '',
            author: '',
            text: '',
            touched: {
                rating: false,
                author: false,
                text: false
            },
            isModalOpen: false
        };

        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
    }

    render() {
        return (
            <React.Fragment>
                <div className="form-group mt-3">
                    <Button outline color="secondary" onClick={this.toggleModal}><i className="fa fa-pencil fa-lg" /> Submit Comment</Button>
                </div>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>

                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Submit Comment</h5>
                        </div>

                        <div className="modal-body">
                            <LocalForm onSubmit={values => this.handleSubmit(values)}>
                                <div className="form-group">
                                    <Label>Rating</Label>
                                    <Control.select model=".rating" name="rating" id="rating"
                                        className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>


                                    </Control.select>
                                </div>

                                <div className="form-group" >
                                    <Label>Your Name</Label>
                                    <Control.text model=".author" name="author" id="author"
                                        className="form-control" placeholder="Your Name"
                                        validators={{
                                            minLength: minLength(2),
                                            maxLength: maxLength(15)
                                        }}>

                                    </Control.text>

                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        component="div"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be at least 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />

                                </div>

                                <div className="form-group">
                                    <Label>Comment</Label>
                                    <Control.textarea model=".text" name="text" id="text"
                                        className="form-control" placeholder="Say something..." rows={6}>
                                    </Control.textarea>
                                </div>
                                <Button type="submit" color="primary">
                                    Submit
                                    </Button>
                            </LocalForm>
                        </div>
                    </div>

                </Modal>
            </React.Fragment>
        );
    }
}

export default CampsiteInfo;
