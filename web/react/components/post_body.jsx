// Copyright (c) 2015 Spinpunch, Inc. All Rights Reserved.
// See License.txt for license information.

var CreateComment = require( './create_comment.jsx' );
var UserStore = require('../stores/user_store.jsx');
var utils = require('../utils/utils.jsx');
var ViewImageModal = require('./view_image.jsx');
var Constants = require('../utils/constants.jsx');

module.exports = React.createClass({
    handleImageClick: function(e) {
        this.setState({startImgId: parseInt($(e.target.parentNode).attr('data-img-id'))});
    },
    componentWillReceiveProps: function(nextProps) {
        var linkData = utils.extractLinks(nextProps.post.message);
        this.setState({ links: linkData["links"], message: linkData["text"] });
    },
    componentDidMount: function() {
        var filenames = this.props.post.filenames;
        var self = this;
        if (filenames) {
            var re1 = new RegExp(' ', 'g');
            var re2 = new RegExp('\\(', 'g');
            var re3 = new RegExp('\\)', 'g');
            for (var i = 0; i < filenames.length && i < Constants.MAX_DISPLAY_FILES; i++) {
                var fileInfo = utils.splitFileLocation(filenames[i]);
                if (Object.keys(fileInfo).length === 0) continue;

                var type = utils.getFileType(fileInfo.ext);

                // This is a temporary patch to fix issue with old files using absolute paths
                if (fileInfo.path.indexOf("/api/v1/files/get") != -1) {
                    fileInfo.path = fileInfo.path.split("/api/v1/files/get")[1];
                }
                fileInfo.path = window.location.origin + "/api/v1/files/get" + fileInfo.path;

                if (type === "image") {
                    $('<img/>').attr('src', fileInfo.path+'_thumb.jpg').load(function(path, name){ return function() {
                        $(this).remove();
                        if (name in self.refs) {
                            var imgDiv = self.refs[name].getDOMNode();
                            $(imgDiv).removeClass('post__load');
                            $(imgDiv).addClass('post__image');
                            var url = path.replace(re1, '%20').replace(re2, '%28').replace(re3, '%29');
                            $(imgDiv).css('background-image', 'url('+url+'_thumb.jpg)');
                        }
                    }}(fileInfo.path, filenames[i]));
                }
            }
        }
    },
    getInitialState: function() {
        var linkData = utils.extractLinks(this.props.post.message);
        return { startImgId: 0, links: linkData["links"], message: linkData["text"] };
    },
    render: function() {
        var post = this.props.post;
        var filenames = this.props.post.filenames;
        var parentPost = this.props.parentPost;
        var postImageModalId = "view_image_modal_" + post.id;
        var inner = utils.textToJsx(this.state.message);

        var comment = "";
        var reply = "";
        var postClass = "";

        if (parentPost) {
            var profile = UserStore.getProfile(parentPost.user_id);
            var apostrophe = "";
            var name = "...";
            if (profile != null) {
                if (profile.username.slice(-1) === 's') {
                    apostrophe = "'";
                } else {
                    apostrophe = "'s";
                }
                name = <a className="theme" onClick={function(){ utils.searchForTerm(profile.username); }}>{profile.username}</a>;
            }

            var message = ""
            if(parentPost.message) {
                message = utils.replaceHtmlEntities(parentPost.message)
            } else if (parentPost.filenames.length) {
                message = parentPost.filenames[0].split('/').pop();

                if (parentPost.filenames.length === 2) {
                    message += " plus 1 other file";
                } else if (parentPost.filenames.length > 2) {
                    message += " plus " + (parentPost.filenames.length - 1) + " other files";
                }
            }

            comment = (
                <p className="post-link">
                    <span>Commented on {name}{apostrophe} message: <a className="theme" onClick={this.props.handleCommentClick}>{message}</a></span>
                </p>
            );

            postClass += " post-comment";
        }

        var loading;
        if (post.did_fail) {
            postClass += " post-fail";
            loading = <a className="post-retry pull-right" href="#" onClick={this.props.retryPost}>Retry</a>;
        } else if (post.is_loading) {
            postClass += " post-waiting";
            loading = <img className="post-loading-gif pull-right" src="/static/images/load.gif"/>;
        }

        var postFiles = [];
        var images = [];
        if (filenames) {
            for (var i = 0; i < filenames.length; i++) {
                var fileInfo = utils.splitFileLocation(filenames[i]);
                if (Object.keys(fileInfo).length === 0) continue;

                var type = utils.getFileType(fileInfo.ext);

                // This is a temporary patch to fix issue with old files using absolute paths
                if (fileInfo.path.indexOf("/api/v1/files/get") != -1) {
                    fileInfo.path = fileInfo.path.split("/api/v1/files/get")[1];
                }
                fileInfo.path = window.location.origin + "/api/v1/files/get" + fileInfo.path;

                if (type === "image") {
                    if (i < Constants.MAX_DISPLAY_FILES) {
                        postFiles.push(
                            <div className="post-image__column" key={filenames[i]}>
                                <a href="#" onClick={this.handleImageClick} data-img-id={images.length.toString()} data-toggle="modal" data-target={"#" + postImageModalId }><div ref={filenames[i]} className="post__load" style={{backgroundImage: 'url(/static/images/load.gif)'}}></div></a>
                            </div>
                        );
                    }
                    images.push(filenames[i]);
                } else if (i < Constants.MAX_DISPLAY_FILES) {
                    postFiles.push(
                        <div className="post-image__column custom-file" key={fileInfo.name+i}>
                            <a href={fileInfo.path+"."+fileInfo.ext} download={fileInfo.name+"."+fileInfo.ext}>
                                <div className={"file-icon "+utils.getIconClassName(type)}/>
                            </a>
                        </div>
                    );
                }
            }
        }

        var embed;
        if (postFiles.length === 0 && this.state.links) {
            embed = utils.getEmbed(this.state.links[0]);
        }

        return (
            <div className="post-body">
                { comment }
                <p key={post.id+"_message"} className={postClass}>{loading}<span>{inner}</span></p>
                { filenames && filenames.length > 0 ?
                    <div className="post-image__columns">
                        { postFiles }
                    </div>
                : "" }
                { embed }

                { images.length > 0 ?
                    <ViewImageModal
                        channelId={post.channel_id}
                        userId={post.user_id}
                        modalId={postImageModalId}
                        startId={this.state.startImgId}
                        imgCount={post.img_count}
                        filenames={images} />
                : "" }
            </div>
        );
    }
});
