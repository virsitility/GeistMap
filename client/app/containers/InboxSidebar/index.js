/*
 *
 * InboxSidebar
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import moment from 'moment'

import Spinner from '../../components/Spinner'

import './styles.scss'

import NodeContentEditor from '../NodeContentEditor'

export class InboxSidebar extends React.Component { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props)

        this.editNode = this.editNode.bind(this)
        this.deleteNode = this.deleteNode.bind(this)
    }


    componentDidMount() {
        const { id } = this.props
        this.props.getAllBatchNodes()
    }

    // createBatchNode(node) {
    //     this.props.createBatchNode(node)
    //         .then((action) => {
    //             this.props.history.push(`/app/inbox/${action.response.result}/`)
    //         })
    // }

    editNode(id) {
        const { history } = this.props
        history.push(`/app/nodes/${id}/edit`)
        this.props.hideInboxSidebar()
    }

    deleteNode(id) {
        const result = window.confirm(`Are you sure you want to remove this node?`)
        console.log('called', id);
        if (result) {
            this.props.removeNode(id)
        }
    }



    render() {
        const { nodes, links, inboxSidebarOpened, loadingStates } = this.props

        if (!inboxSidebarOpened) {
            return null
        }

        if (loadingStates.GET_ALL_BATCH_NODES) {
            return <Spinner />
        }

        const items = nodes.map(node => (
            <InboxItem 
                node={node} 
                deleteNode={this.deleteNode}
                editNode={this.editNode}
            />
        ))


        return (
            <div className="inboxSidebar">
                { items }
            </div>
        );
    }
}


import { FlatButton } from '../../components/button'
// only rendered on mobile
const DeleteButton = (props) => (
    <FlatButton iconName="trash" className="inboxSidebar-delete" {...props} />
)
const EditButton = (props) => (
    <FlatButton iconName="write" {...props} />
)


class InboxItem extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { node, deleteNode, editNode } = this.props

        return (
            <div className="inboxSidebar-item">
                <div className="inboxSidebar-header">
                    <h2>{ node.properties.name }</h2>
                    <span>
                        { moment.unix(node.properties.modified / 1000).fromNow() } 
                    </span>
                </div>

                <div className="inboxSidebar-content">
                    <NodeContentEditor
                        id={node.id}
                        withToolbar={false}
                        readOnly={true}
                    />
                </div>

                <div className="inboxSidebar-actions">
                    <EditButton onClick={() => editNode(node.id)} />
                    <DeleteButton onClick={() => deleteNode(node.id)}/>
                </div>

                <div className="inboxSidebar-expand">
                </div>

                <div className="inboxSidebar-fadeout"></div>
            </div>
        )
    }
}
InboxItem.propTypes = {
    
}

import { getNode, getBatchNodes, getEdgesForNodes } from '../../reducers.js'



function mapStateToProps(state, props) {
    const nodes = getBatchNodes(state)

    return {
        nodes: nodes,
        links: getEdgesForNodes(state, _.map(nodes, node => node.id)),
        loadingStates: state.loadingStates,
        inboxSidebarOpened: state.uiState.inboxSidebar.opened
    }
}

import { createBatchNode, getAllBatchNodes, removeNode } from '../../actions/async'
import { hideInboxSidebar } from '../../actions/ui'

export default connect(mapStateToProps, {
    createBatchNode,
    getAllBatchNodes,
    hideInboxSidebar,
    removeNode,
})(withRouter(InboxSidebar));