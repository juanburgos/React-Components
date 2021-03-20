import React from "react";
import { Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Button, Modal, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';

const maxLength = len => val => !val || (val.length <= len);
const minLength = len => val => val && (val.length >= len);

function RenderCampsite({ campsite }) {
    return (
        <div className="col-md-5 m-1">
            <Card>
                <CardImg top src={campsite.image} alt={campsite.name} />
                <CardBody>
                    <CardText>{campsite.description}</CardText>
                </CardBody>
            </Card>
        </div>
    );
}

function RenderComments({ comments }) {

    if (comments) {

        return (
            <React.Fragment>
                <div className="col-md-5 m-1">
                    <h4>Comments</h4>
                    {comments.map((comment) => {
                        return (
                            <div>
                                <p>{comment.text}</p>
                -- {comment.author}{" "}
                                {new Intl.DateTimeFormat("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "2-digit",
                                }).format(new Date(Date.parse(comment.date)))}
                            </div>
                        );
                    })}
                    <CommentForm />
                </div>

            </React.Fragment>

        );
    } else {
        return <div>No comments available</div>;
    }
}

function CampsiteInfo(props) {
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
                    <RenderComments comments={props.comments} />
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
            rating: 1,
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
        console.log("Current state is: " + JSON.stringify(values));
        alert("Current state is: " + JSON.stringify(values));
        this.toggleModal();
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

                                        {/* Logic goes here */}

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
