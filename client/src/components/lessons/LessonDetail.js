import React from "react";
import { Query, Mutation } from "react-apollo";
import Queries from "../../graphql/queries";
import { withRouter, Redirect } from "react-router-dom";
import Repl from "../repl/repl";
import InstructionWindow from "../instructionWindow/instructionWindow";
import { UPDATE_LESSONS_COMPLETED } from "../../graphql/mutations";
const { FETCH_LESSON } = Queries;

class LessonDetail extends React.Component {
  constructor(props){
    super(props);
    this.state = 
      {  
        questionIdx: 0, correctAnswer: "", incorrectAnswer: "", 
        displayHintWindow: false, displayReplWindow: false,
        answered: [], answeredCorrect: [], numQuestion: 5,
      };
    this.closeWindow = this.closeWindow.bind(this);
    this.openWindow = this.openWindow.bind(this);
  }
  chooseAnswer(e, isCorrect, answer){
    e.stopPropagation();
    let currentIdx = this.state.questionIdx;
    if (isCorrect){
      this.setState(state => {
        let newArry = 
          state.answeredCorrect.includes(currentIdx) ? state.answeredCorrect : state.answeredCorrect.concat(currentIdx);
        return {
          correctAnswer: `> ${answer} \n> Correct!`, 
          incorrectAnswer: "", 
          answered: this.state.answered, 
          answeredCorrect: newArry
        }
      });
    } else {
      this.setState(state => {
        let newArry =
          state.answered.includes(currentIdx) ? state.answered : state.answered.concat(currentIdx);
        return { 
          incorrectAnswer: `> ${answer} \n> Sorry, try again`, 
          correctAnswer: "", 
          answered: newArry, 
          answeredCorrect: this.state.answeredCorrect 
        }
      });
    }
    console.log(`corrects: ${this.state.answeredCorrect}`);
    console.log(`incorrects: ${this.state.answered}`);
  }
  goBack(){
    this.props.history.goBack();
  }
  closeWindow() {
    this.setState({ "displayHintWindow": false }) ;
    this.setState({ "displayReplWindow": false }) ;
  }
  openWindow(e, type) {
    e.stopPropagation();
    this.setState({ [type]: true });
  }
  render() {
    if (this.state.questionIdx >= this.state.numQuestion) {
      localStorage.setItem('lessonId', this.props.match.params.id)
      return <Redirect to='/lessonEnd'/>
    }
    return (
      <div className="lessonContainer" onClick={e => this.closeWindow()}>
          <Query query={FETCH_LESSON} variables={{ id: this.props.match.params.id }}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error</p>;
              let questionArray = data.lesson.questions,
                questionCurrent = questionArray[this.state.questionIdx],
                questionExample = "", 
                hintWindowClassName = "hide-hint-window",
                replWindowClassName = "hide-repl-window";
              let backButton = <button style={{ opacity: '0' }}></button> 
              let nextButton = <button style={{opacity:'0'}}></button>
              if (this.state.displayHintWindow) hintWindowClassName = "display-hint-window";
              if (this.state.displayReplWindow) replWindowClassName = "display-repl-window";
              if (this.state.questionIdx > 0) {
                backButton =  (
                  <button
                    onClick={e => { this.setState({ 
                      questionIdx: this.state.questionIdx - 1, 
                      correctAnswer: "", incorrectAnswer: "",
                      answered: this.state.answered, answeredCorrect: this.state.answeredCorrect }) 
                    }}
                    className="back-button">Back
                  </button>
                );
              }
              if (this.state.answeredCorrect.includes(this.state.questionIdx)) {
                nextButton = (
                  <button
                    onClick={e => { this.setState({ 
                      questionIdx: this.state.questionIdx + 1, 
                      correctAnswer: "", incorrectAnswer: "",
                      answered: this.state.answered, answeredCorrect: this.state.answeredCorrect }) 
                    }}
                    className="next-button">Next
                  </button>
                );
              }
              console.log(this.state.questionIdx);
              if (this.state.questionIdx < questionArray.length && questionCurrent.example){
                questionExample = questionCurrent.example;
              }
              //ghost code
              if (this.state.questionIdx >= questionArray.length) {
                this.props.history.push('/lessonEnd');
                return ( 
                  <div className="end-of-lesson">{`End of lesson. You got 
                    ${
                      this.state.answeredCorrect.length -
                      this.state.answered.length
                    } questions correct! \n 
                    userId: ${localStorage.getItem("userId")}
                  `}
                    <button 
                      className="end-of-lesson-button"
                      onClick={this.goBack.bind(this)} >Back to Lessons
                    </button>
                  </div>
                )
              //end of ghost code
              } else {
                return (
                  <div className="lesson-detail-page">
                    <div className="lesson-window">
                      <div><h2>Current Lesson: {data.lesson.title}</h2></div>
                      <div><h3>Prompt: {questionCurrent.prompt}</h3></div>
                      <div id="terminal">
                        <div id="top-terminal-bar"></div>
                          <p id="example">{`  > ${questionExample}`}</p>
                          <p id="correct-answer">{this.state.correctAnswer}</p>
                          <p id="incorrect-answer">{this.state.incorrectAnswer}</p>
                      </div>
                      <div className="answer-window">
                        <ul className="answer-choice-list">
                          {questionCurrent.answers.map((answer) => {
                            return (
                              <li 
                                className="answer-choice"
                                key={answer._id} 
                                onClick={e => this.chooseAnswer(e, answer.isCorrect, answer.answer)}>
                                <div className="answer-text">{answer.answer}</div>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                      <div className="lesson-button">
                        <div className="hint-repl-button">
                          <button
                            onClick={e => this.openWindow(e, "displayHintWindow")}>
                            Open Hint Window
                          </button>
                          <InstructionWindow
                            propsClassName={`${hintWindowClassName}`}
                            hintText={questionCurrent.hint} />
                          <button
                            onClick={e => this.openWindow(e, "displayReplWindow")}>
                            Open Repl Window
                          </button>
                          <div
                            className={`${replWindowClassName} repl-window`}
                            onClick={e => e.stopPropagation()}>
                            <Repl />
                          </div>
                        </div>
                        <div className="lesson-nav-bar">
                          {backButton}
                          {nextButton}
                        </div>
                      </div>
                    </div>
                    <div className="instruction-window">
                    </div>
                  </div>
                )

              }
            }}
          </Query>
      </div>
    )
  }
};

export default withRouter(LessonDetail);
