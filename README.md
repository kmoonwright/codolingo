# Codolingo
 [Codolingo Live](https://codolingo.herokuapp.com/)

## Architecture and Technologies
* [GraphQL](https://www.apollographql.com/)
* [Express](https://expressjs.com/)
* [React](https://reactjs.org/)
* [Apollo](https://www.apollographql.com/)

![Codolingo-Splash][screen1]

## Overview and Features
A practice platform for aspiring programmers focusing on the fundamentals of Ruby, JavaScript, and SQL. Registered users can practice their skills, working through progressively more difficult lessons that build on one another. The responsive interface will notify users of incorrect answers and hints are offered to provide further insight. This project was inspired by Duolingo for its expressive UI and content delivery network. 

### User Auth
User credentials are hashed and salted using BCrypt and verified using JSON Web Tokens. Tokens retrieved from the mutation are decoded and matched with the database asyncronously. 
```javascript
const verifyUser = async data => {
  try {
    const { token } = data;
    const decoded = jwt.verify(token, keys.secretOrKey);
    const { id } = decoded;
    const loggedIn = await User.findById(id).then(user => {
      return user ? true : false;
    });

    return { loggedIn };
  } catch (err) {
    return { loggedIn: false };
  }
};
```

### Database Connectivity
The Database is tailor-made with all data relationships, allowing the frontend components to fetch data seamlessly. The QuestionType serves as the lynchpin of the database, connecting the lessons and the multitude of answers, ultimately providing an easily scalable product.

```javascript
  const QuestionType = new GraphQLObjectType({
    name: "QuestionType",
    fields: () => ({
      _id: { type: GraphQLID },
      prompt: { type: GraphQLString },
      example: { type: GraphQLString },
      hint: { type: GraphQLString },
      answers: { 
        type: new GraphQLList(require("./answer_type")),
        resolve(parentValue) {
          return Question.findAnswers(parentValue._id);
        }
      },
      lessons: {
        type: new GraphQLList(require("./lesson_type")),
        resolve(parentValue) {
          return Question.findById(parentValue.id)
            .populate("lessons")
            .then(question => question.lessons);
        }
      }
    })
  })
```

Questions are fully mutable, allowing for greater flexibility when devloping a curriculum.
```javascript
QuestionSchema.statics.updateQuestion = function (questionId, prompt, example, hint) {
  const Question = mongoose.model("questions");

  return Question.findById(questionId).then(question => {
    if (question.prompt || question.example || question.hint) {
      question.prompt = prompt;
      question.example = example;
      question.hint = hint;

      question.save().then(question => question);
    }
  })
}
```

![Codolingo-Demo][screen2]

## Future Plans
* Upgradeable accounts utilizing achievements and rewards.
* More expansive curriculum implementing REPL functionality.
* Courses convering additional languages (Python, Swift).

[screen1]: https://github.com/LukisKhan/Codolingo/blob/master/wiki/screen1.png
[screen2]: https://github.com/LukisKhan/Codolingo/blob/master/wiki/screen2.png