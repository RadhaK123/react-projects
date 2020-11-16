import './App.css';
import {messages} from './data/data.json';
import React, {Component} from 'react';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            sortedUniqueMessages: []
        };
        this.pageSize = 5;
    }

    componentDidMount = () => {
        this.processMessages();
    };

    processMessages = () => {
        const uniqueMessageMap = new Map();

        //Remove duplicate messages
        this.removeDuplicateMessages(messages, uniqueMessageMap);

        // Sort messages by timestamp.
        const sortedUniqueMessages = this.sortMessages(uniqueMessageMap);

        //Set the state
        this.setState({sortedUniqueMessages});
    };


    removeDuplicateMessages = (msgList, uniqueMessageMap) => {
        msgList.forEach((msg, index) => {
            // Use the 'uuid+content' as the key to the map because the input sample
            //looks simple. Another type of key should probably be used if
            //content will be longer or complex data type.
            let msgKey = msg.uuid + '' + msg.content;  //Convert it to a string

            // if there are duplicate messages, the later one replaces the older message.
            uniqueMessageMap.set(msgKey, msg);
        });
    };  //removeDuplicateMessages


    sortMessages = (uniqueMessageMap) => {
        const messageIterator = uniqueMessageMap.values();
        const sortedMessages = [];

        //Get the messages out of the messageMap;
        let msg;
        while ((msg = messageIterator.next().value) !== undefined) {
            sortedMessages.push(msg);
        };

        //Sort on timestamp
        sortedMessages.sort((msg1, msg2) => {
            const time1 = new Date(msg1.sentAt);
            const time2 = new Date(msg2.sentAt);

            if (time1 < time2)
                return -1;
            else if (time1 > time2)
                return 1;
            return 0;
        });

        sortedMessages.forEach((object) => {
            console.log(`TIME ${object.sentAt}:UUID ${object.uuid}:CONTENT ${object.content}:SENDER ${object.senderUuid} `)
        });

        return sortedMessages;
    };


    processTimeStamp = (timeString) => {
        const dayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


        const sentAt = new Date(timeString);

        //Format the day, date and time
        const dateSegment = `${dayIndex[sentAt.getDay()]} ${monthIndex[sentAt.getMonth()]} ${sentAt.getDate()}, ${sentAt.getFullYear()}`;
        let hour = sentAt.getHours();
        let min = sentAt.getMinutes().toString().padStart(2, '0');

        let amPM = 'am';
        if (hour > 12)
            amPM = 'pm';

        hour = hour > 12 ? hour % 12 : hour;

        let time = `${hour}:${min} ${amPM}`;

        return dateSegment + ' at ' + time;
    };     //processTimeStamp


    deleteMessage = (e) => {
        const deletedMsg = e.target.dataset.key;

        const {sortedUniqueMessages} = this.state;
        sortedUniqueMessages.splice(deletedMsg, 1);
        this.setState({sortedUniqueMessages});
    };

    changePage = (e) => {
        const where = e.target.id;
        let {currentPage} = this.state;

        //Figure what page comes up  next
        if (where === "prev") {
            currentPage -= 1;
        } else {
            currentPage += 1;
        }

        this.setState({currentPage});
    };

    render() {
        const {sortedUniqueMessages, currentPage} = this.state;

        //Find total Number of pages
        const totalMessages = sortedUniqueMessages.length;
        const totalPages = (totalMessages%this.pageSize === 0) ? (totalMessages/this.pageSize) : Math.floor((totalMessages/this.pageSize))+1;

        //Identify the messages for this page.
        const startIndex = (this.state.currentPage-1)*this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const currPageMessages=sortedUniqueMessages.slice(startIndex, endIndex);


        // Make a list of all the messages that belong to this page.
        const messageList = currPageMessages.map((msg, index) => {
            const timeStr = this.processTimeStamp(msg.sentAt);
            const key = `msg${index}`;
            return (
                // Allow deletion of messages
                <li key={key}>
                    <p>
                        <label className="msgLabel">Sender: {msg.senderUuid}</label><br/>
                        <label className="msgLabel">Received at : {timeStr}</label><br/>
                        <label className="msgLabel">Content: {msg.content}</label><br/>
                        <button className="button" data-key={index} onClick={this.deleteMessage}>Delete Message</button>
                    </p>
                </li>
            );
        });

        //Make the page number buttons
        let pageNumbers;
            if (totalPages > 0) {
                pageNumbers = <div className="pageNumber">
                    <button className="button" id="prev" onClick={this.changePage} disabled={this.state.currentPage === 1}>Prev</button>
                    {(totalPages >= currentPage) ?
                    <label>Page {currentPage} of {totalPages}</label>
                    : null}
                    <button className="button" id="next" onClick={this.changePage} disabled={this.state.currentPage >= totalPages}>Next</button>
                </div>
            } else {
                pageNumbers = null;
            }


        //Render the messages for this page and the page numbers
        return (
            <div className="App">
                <h1>Chat Messages</h1>
                    <div className="messageList">
                        <ul>
                            {messageList}
                        </ul>
                    </div>
                {pageNumbers}
            </div>
        );
    }

}

export default App;

