import { useState, useEffect, useRef } from 'react';
import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { additionalRemarkData, bulletinData, ccomData } from './components/Data';
import audio from "./assets/hallelujahSound.mp3";

function App() {
  const [startDate, setStartDate] = useState(Date.now());
  const [noOfBulletin, setNoOfBulletin] = useState(5);
  const [textToCopy, setTextToCopy] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  
  const ccomDataRef = useRef(null);
  const bulletinDataRef = useRef(null);
  const textAreaDataRef = useRef(null);
  const audioRef = useRef(new Audio(audio));

  const formattedMonth = moment(startDate).format("MM-DD");
  const dayOfWeek = moment(startDate).format("dddd");
  const oneWeekFromStartDate = moment(startDate).subtract(7, "days").format('YYYY-MM-DD');

  useEffect(() => {
    audioRef.current.volume = 0.4;
    return () => {
      audioRef.current.pause();
    };
  }, []);

  const processTextContent = () => {
    if (!ccomDataRef.current || !bulletinDataRef.current || !textAreaDataRef.current) return '';
    
    // CCOM Data - Safe extraction with null checks
    let ccomDataToBeCopied = '';
    const h2CcomElement = ccomDataRef.current.querySelector('h2');
    const pCcomElement = ccomDataRef.current.querySelector('p');
    
    if (h2CcomElement) {
      ccomDataToBeCopied += h2CcomElement.textContent + "\r\n";
    }
    
    if (pCcomElement) {
      ccomDataToBeCopied += pCcomElement.textContent;
    }
    
    // Bulletin Data - Safe extraction
    let bulletinDataToBeCopied = '';
    const bulletinItems = bulletinDataRef.current.querySelectorAll('li');
    
    if (bulletinItems && bulletinItems.length > 0) {
      bulletinDataToBeCopied = Array.from(bulletinItems)
        .map(li => li.textContent)
        .join("\r\n");
    }
    
    // Additional Remarks - Safe extraction
    let additionalRemarkToBeCopied = '';
    const h2TextAreaElement = textAreaDataRef.current.querySelector('h2');
    const remarkItems = textAreaDataRef.current.querySelectorAll('li');
    
    if (h2TextAreaElement) {
      additionalRemarkToBeCopied += h2TextAreaElement.textContent + "\r\n";
    }
    
    if (remarkItems && remarkItems.length > 0) {
      additionalRemarkToBeCopied += Array.from(remarkItems)
        .map(li => li.textContent)
        .join("\r\n");
    }
    
    return ccomDataToBeCopied + "\n\n" + "二、公告抽問合格，摘要如下:" + "\r\n" + bulletinDataToBeCopied + "\n\n" + additionalRemarkToBeCopied;
  };

  useEffect(() => {
    // Wait for refs to be populated
    if (ccomDataRef.current && bulletinDataRef.current && textAreaDataRef.current) {
      setTextToCopy(processTextContent());
    }
  }, [startDate, noOfBulletin]);

  const getCCOMQuestion = () => {
    const randomCCOMQuestion = [];
    for (let i = 0; i < ccomData.length; i++) {
      if ((formattedMonth >= ccomData[i]["startDate"]) && (formattedMonth <= ccomData[i]["endDate"])) {
        if (ccomData[i]["chapter"] === "12") {
          switch (dayOfWeek) {
            case "Monday":
              randomCCOMQuestion.push(`1. 依公告抽問飛安暨主題加強宣導月題庫。抽問 F2${ccomData[i]["questionList"][0]}，抽問結果正常。`);
              break;
            case "Tuesday":
              randomCCOMQuestion.push(`1. 依公告抽問飛安暨主題加強宣導月題庫。抽問 F2${ccomData[i]["questionList"][1]}，抽問結果正常。`);
              break;
            case "Wednesday":
              randomCCOMQuestion.push(`1. 依公告抽問飛安暨主題加強宣導月題庫。抽問 F2${ccomData[i]["questionList"][2]}，抽問結果正常。`);
              break;
            case "Thursday":
              randomCCOMQuestion.push(`1. 依公告抽問飛安暨主題加強宣導月題庫。抽問 F2${ccomData[i]["questionList"][3]}，抽問結果正常。`);
              break;
            case "Friday":
              randomCCOMQuestion.push(`1. 依公告抽問飛安暨主題加強宣導月題庫。抽問 F2${ccomData[i]["questionList"][4]}，抽問結果正常。`);
              break;
            case "Saturday":
              randomCCOMQuestion.push(`1. 依公告抽問飛安暨主題加強宣導月題庫。抽問 F2${ccomData[i]["questionList"][5]}，抽問結果正常。`);
              break;
            case "Sunday":
              randomCCOMQuestion.push(`1. 依公告抽問飛安暨主題加強宣導月題庫。抽問 F2${ccomData[i]["questionList"][6]}，抽問結果正常。`);
              break;
            default:
              break;
          }
        } else {
          const randomNumber = Math.floor(Math.random() * (ccomData[i]["questionList"].length));
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
        <li key={`id${item.id}`}>{`${index + 1}. ${item.id} : ${item.title}`}</li>
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
    });

  return (
    <>
      <div className="header-Container">
        <h1 className="title neonText">e-<span className="redNeon neon-flicker">TAHI</span> Report</h1>
        <small className='versionNo'>最後更新: {bulletinData[bulletinData.length - 1].date > additionalRemarkData[additionalRemarkData.length - 1].date ? moment(bulletinData[bulletinData.length - 1].date).format("YYYY-MM-DD") : moment(additionalRemarkData[additionalRemarkData.length - 1].date).format("YYYY-MM-DD")}</small>
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
        <div id="ccomData" ref={ccomDataRef}>
          <h2>一、飛安抽問合格，摘要如下：</h2>
          {getCCOMQuestion()}
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
        <div>
          <h2>二、公告抽問合格，摘要如下:</h2>
          <div className="bulletinData-container">
            <div className="leftColumn">
              {bulletinTimeStamp}
            </div>
            <div id="bulletinData" ref={bulletinDataRef} className="rightColumn">
              {newestBulletin}
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className='additionalRemarks-Container'>
        <legend>Team+宣達事項</legend>
        <div id="textAreaData" ref={textAreaDataRef}>
          <h2>三、其他：</h2>
          {filteredRemarks.length < 1 ? <li>1. 無。</li> : filteredRemarks}
        </div>
      </fieldset>

      <button
        className={`copyButton ${copyStatus ? "copied" : ""}`}
        onClick={() => {
          const currentText = processTextContent();
          navigator.clipboard.writeText(currentText)
            .then(() => {
              console.log("Text copied successfully:\n\n", currentText);
              setCopyStatus(true);
              setTimeout(() => setCopyStatus(false), 2000);
              audioRef.current.play();
            })
            .catch(err => {
              console.error("Failed to copy text: ", err);
            });
        }}
      >
        {copyStatus ? "COPIED ✅" : "COPY 📋"}
      </button>
    </>
  )
}

export default App