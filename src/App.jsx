import { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { additionalRemarkData, bulletinData, ccomData } from './components/Data';
import audio from "./assets/hallelujahSound.mp3";

function App() {
  const [ startDate, setStartDate ] = useState(Date.now());
  const [ noOfBulletin, setNoOfBulletin ] = useState(5);
  const [ additionalRemark, setAdditionalRemark ] = useState("1.無。");
  const [ textToCopy, setTextToCopy ] = useState('');
  const [ copyStatus, setCopyStatus ] = useState(false);
  
  const formattedMonth = moment(startDate).format("MM-DD");
  const dayOfWeek = moment(startDate).format("dddd");
  const oneWeekFromStartDate = moment(startDate).subtract(7, "days").format('YYYY-MM-DD')

  const hallelujahSound = new Audio(audio)
  hallelujahSound.volume = 0.4;

  useEffect(() => {
    const ccomDataToBeCopied = document.querySelector("#ccomData").innerHTML
    .replaceAll(/(<h2>|<p>|<\/p>)/g,"")
      .replaceAll(/(<\/h2>)/g,"\r\n");
    const bulletinDataToBeCopied = document.querySelector("#bulletinData").innerHTML
      .replaceAll(/(<h2>|<\/h2>|<\/li>)/g,"")
      .replaceAll(/(<li>)/g,"\r\n");
    const additionalRemarkToBeCopied = document.querySelector("#textAreaData").innerHTML
      .replaceAll(/(<h2>|<\/h2>|<\/li>)/g,"")
      .replaceAll(/(<li>)/g,"\r\n");
    // const combinedText = ccomDataToBeCopied + "\n\n" + "二、公告抽問合格，摘要如下:" + bulletinDataToBeCopied + "\n\n" + additionalRemarkToBeCopied
    const combinedText = ccomDataToBeCopied + "\n\n" + bulletinDataToBeCopied + "\n\n" + additionalRemarkToBeCopied
    setTextToCopy(combinedText);
  },[startDate, noOfBulletin, additionalRemark])

  const getCCOMQuestion = () => {
    const randomCCOMQuestion = [];
    for (let i=0; i<ccomData.length; i++) {
      if ((formattedMonth >= ccomData[i]["startDate"]) && (formattedMonth <= ccomData[i]["endDate"])) {
        if (ccomData[i]["chapter"] === "12") {
          switch(dayOfWeek) {
            case "Monday":
              console.log(dayOfWeek)
              randomCCOMQuestion.push(`1. 依公告抽問飛安暨主題加強宣導月題庫。抽問 F2${ccomData[i]["questionList"][0]}，抽問結果正常。`);
              break;
            case "Tuesday":
              console.log(dayOfWeek)
              randomCCOMQuestion.push(`1. 依公告抽問飛安暨主題加強宣導月題庫。抽問 F2${ccomData[i]["questionList"][1]}，抽問結果正常。`);
                break;
            case "Wednesday":
              console.log(dayOfWeek)
              randomCCOMQuestion.push(`1. 依公告抽問飛安暨主題加強宣導月題庫。抽問 F2${ccomData[i]["questionList"][2]}，抽問結果正常。`);
              break;
            case "Thursday":
              console.log(dayOfWeek)
              randomCCOMQuestion.push(`1. 依公告抽問飛安暨主題加強宣導月題庫。抽問 F2${ccomData[i]["questionList"][3]}，抽問結果正常。`);
                break;
            case "Friday":
              console.log(dayOfWeek)
              randomCCOMQuestion.push(`1. 依公告抽問飛安暨主題加強宣導月題庫。抽問 F2${ccomData[i]["questionList"][4]}，抽問結果正常。`);
              break;
            case "Saturday":
              console.log(dayOfWeek)
              randomCCOMQuestion.push(`1. 依公告抽問飛安暨主題加強宣導月題庫。抽問 F2${ccomData[i]["questionList"][5]}，抽問結果正常。`);
                break;
            case "Sunday":
              console.log(dayOfWeek)
              randomCCOMQuestion.push(`1. 依公告抽問飛安暨主題加強宣導月題庫。抽問 F2${ccomData[i]["questionList"][6]}，抽問結果正常。`);
              break;
          }
        } else {
          const randomNumber = Math.floor(Math.random()*(ccomData[i]["questionList"].length));
          randomCCOMQuestion.push(`1. 抽問 F2 CCOM Ch.${ccomData[i]["questionList"][randomNumber]}，抽問結果正常。`);
        }
      } 
    }
    return <p>{randomCCOMQuestion}</p>;
  }

  const bulletinTimeStamp = bulletinData
  .filter(criteria => moment(criteria.date).isSameOrBefore(startDate))
  .slice(-noOfBulletin) //No of bulletin displayed based on input
  .map((item) => {
    return (
      <li key={`id${item.id}${item.date}${item.time}`}>{`${item.date} : ${item.time}`}</li>
    )
  });

  const newestBulletin = bulletinData
    .filter(criteria => moment(criteria.date).isSameOrBefore(startDate))
    .slice(-noOfBulletin) //No of bulletin displayed based on input
    .map((item, index) => {
      return (
        <li key={`id${item.id}`}>{`${index+1}. ${item.id} : ${item.title}`}</li>
      )
    });

  const filteredRemarks = additionalRemarkData
    .filter(criteria1 => moment(criteria1.date).isSameOrBefore(startDate))
    .filter(criteria2 => moment(criteria2.date).isSameOrAfter(oneWeekFromStartDate))
    .map((item, index) => {
      return (
        <li key={item.message}>
          {`${index + 1}. ${item.message}`}
        </li>
      )
    })

  const handleCopyButton = () => {
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 3000); // Reset status after 3 seconds
    
    const ccomDataToBeCopied = document.querySelector("#ccomData").innerHTML
      .replaceAll(/(<h2>|<p>|<\/p>)/g,"")
      .replaceAll(/(<\/h2>)/g,"\r\n");
    const bulletinDataToBeCopied = document.querySelector("#bulletinData").innerHTML
      .replaceAll(/(<h2>|<\/h2>|<\/li>)/g,"")
      .replaceAll(/(<li>)/g,"\r\n");
    const additionalRemarkToBeCopied = document.querySelector("#textAreaData").innerHTML
      .replaceAll(/(<h2>|<\/h2>|<\/li>)/g,"")
      .replaceAll(/(<li>)/g,"\r\n");
    // const combinedText = ccomDataToBeCopied + "\n\n" + "二、公告抽問合格，摘要如下:" + bulletinDataToBeCopied + "\n\n" + additionalRemarkToBeCopied
    const combinedText = ccomDataToBeCopied + "\n\n" + bulletinDataToBeCopied + "\n\n" + additionalRemarkToBeCopied
    console.log(combinedText)
    setTextToCopy(combinedText);
    hallelujahSound.play();
  };

  return (
    <>
      <div className="header-Container">
        <h1 className="title neonText">e-<span className="redNeon neon-flicker">TAHI</span> Report</h1>
        <small className='versionNo'>最後更新: {bulletinData[bulletinData.length - 1].date > additionalRemarkData[additionalRemarkData.length-1].date ? moment(bulletinData[bulletinData.length - 1].date).format("YYYY-MM-DD") : moment(additionalRemarkData[additionalRemarkData.length - 1].date).format("YYYY-MM-DD")}</small>
        <p className="warning">⚠️留意不要複製到任務之後的公告⚠️</p>
        <div className='datePicker-container'>
          <DatePicker 
            showIcon
            name="datepicker"
            selected={startDate} 
            onChange={(date) => setStartDate(date)} 
          />
        </div>
      </div>
      
      <fieldset className='ccom-Container'>
        <legend>CCOM抽問</legend>
        <div id="ccomData">
          <h2>一、飛安抽問合格，摘要如下：</h2>
          {(() => getCCOMQuestion())()}
        </div>
      </fieldset>

      <fieldset className='bulletin-Container'>
        <legend>公告宣導/抽問</legend>
        <label name="bulletinNo">
          公告數量<em> (最少5筆) </em>
          <input 
            className="bulletin-input"
            type="number"
            name="bulletinNo" 
            defaultValue={noOfBulletin} 
            min="5"
            onChange={(event) => setNoOfBulletin(event.target.value)}
          />
        </label>
        {/* <div>
          <h2>二、公告抽問合格，摘要如下:</h2>
          <div className="bulletinData-container">
            <div className="leftColumn">
              {bulletinTimeStamp}
            </div>
            <div id="bulletinData" className="rightColumn">
              {newestBulletin}
            </div>
          </div>
        </div> */}
        <div id="bulletinData">
          <h2>二、公告抽問合格，摘要如下:</h2>
              {newestBulletin}
        </div>
      </fieldset>

      <fieldset className='additionalRemarks-Container'>
        <legend>其他</legend>
        <div id="textAreaData">
          <h2>三、其他：</h2>
          {filteredRemarks.length < 1 ? <li>1. 無。</li> : filteredRemarks}
        </div>
      </fieldset>

      <CopyToClipboard text={textToCopy} >
        <button 
          className={`copyButton ${copyStatus ? "copied" : ""}`}
          onClick={handleCopyButton}
        >
          {copyStatus ? "COPIED ✅" : "COPY 📋"}
        </button>
      </CopyToClipboard>
    </>
  )
}

export default App