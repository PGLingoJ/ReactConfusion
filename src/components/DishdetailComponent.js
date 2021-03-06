import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Label, Col, Row, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

function RenderDish({dish}) {
    return(
        <div className="col-12">
            <Card>
                <CardImg width="100" src={dish.image} alt={dish.name} />
                <CardBody>
                    <CardTitle>{dish.name}</CardTitle>
                    <CardText>{dish.description}</CardText>
                </CardBody>
            </Card>
        </div>
    );
}

function RenderComments({comments, addComment, dishId}){
    if (comments != null){
        let comms = comments.map((comm, i) => {
            let date = new Intl.DateTimeFormat('en-US', {
                year:'numeric',
                month: 'short',
                day: '2-digit'
            }).format(new Date(Date.parse(comm.date)))

            return (
                <ul key={comm.id} className="list-unstyled">
                    <li className="comment">{comm.comment}</li>
                    <li className="author">-- {comm.author}, {date}</li>
                </ul>
            );
        })

        return (
            <div className="col-12">
                <h4>Comments</h4>
                <div>{comms}</div>
                <CommentForm dishId={dishId} addComment={addComment}/>
            </div>
        );
    } else {
        return(<div></div>);
    }
}


const DishDetail = (props) => { //Can also be written as function DishDetail(props){}

    console.log('Dishdetail Component render invoked');

    if (props.dish != null) {
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish} />
                    </div>
                    <div className="col-12 col-md-5 m-1">
                        <RenderComments comments={props.comments}
                            addComment={props.addComment}
                            dishId={props.dish.id} />
                    </div>
                </div>
            </div>
        );
    } else {
        return (<div></div>);
    }
}

export class CommentForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isNavOpen: false,
            isModalOpen: false
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal() {
        this.setState({ isModalOpen: !this.state.isModalOpen });
    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.addComment(this.props.dishId, values.rating, values.author, values.comment)
    }

    render() {
        return (
            <div>
                <Button outline onClick={this.toggleModal}>
                    <span className="fa fa-pencil fa-lg"> Submit comment</span>
                </Button>
                <div className="row row-content">
                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}> Submit Comment</ModalHeader>
                        <ModalBody>
                            <div className="col-12">
                                <LocalForm onSubmit={(values) => this.handleSubmit(values)} >
                                    <Row className="form-group">
                                        <Label htmlFor="rating" md={12}>Rating</Label>
                                        <Col md={12}>
                                            <Control.select model=".rating" name="rating" className="form-control" >
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                            </Control.select>
                                        </Col>
                                    </Row>
                                    <Row className="form-group">
                                        <Label htmlFor="author" md={12}>Your Name</Label>
                                        <Col md={12}>
                                            <Control.text model=".author" id="author" name="author" placeholder="Your Name"
                                                className="form-control"
                                                validators={{
                                                    required,
                                                    minLength: minLength(3),
                                                    maxLength: maxLength(15)
                                                }} />
                                            <Errors
                                                className="text-danger"
                                                model=".author"
                                                show="touched"
                                                messages={{
                                                    required: 'Required',
                                                    minLength: 'Must be greater than 2 characters',
                                                    maxLength: 'Must be 15 charaters or less' }} />
                                        </Col>
                                    </Row>
                                    <Row className="form-group">
                                        <Label htmlFor="feedback" md={12}>Your feedback</Label>
                                        <Col md={12}>
                                            <Control.textarea model=".comment" id="comment" name="comment" rows="6"
                                                className="form-control"
                                                validators={{
                                                    required }} />
                                            <Errors
                                                className="text-danger"
                                                model=".comment"
                                                show="touched"
                                                messages={{ required: 'Required' }} />
                                        </Col>
                                    </Row>
                                    <Button type="submit" value="submit" color="primary">Submit</Button>
                                </LocalForm>
                            </div>
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default DishDetail;
