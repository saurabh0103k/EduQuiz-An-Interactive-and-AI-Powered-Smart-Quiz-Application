import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import { getQuiz, submitQuiz } from "../api";

const TakeQuiz = () => {
  const { id } = useParams();
  const name = localStorage.getItem("name");

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await getQuiz(id);
      setQuiz(data);
    })();
  }, [id]);

  const choose = (qid, opt) => {
    setAnswers((prev) => ({ ...prev, [qid]: opt }));
  };

  const submit = async () => {
    const formatted = Object.entries(answers).map(
      ([question_id, selected_option]) => ({
        question_id: Number(question_id),
        selected_option
      })
    );
    const { data } = await submitQuiz(id, formatted);
    setResult(data);
  };

  if (!quiz) return null;

  return (
    <div className="dashboard-container">
      <Sidebar role="student" />
      <main className="dashboard-main">
        <TopBar name={name} role="student" />

        <div className="card p-3">
          <h4>{quiz.quiz.title}</h4>
          <p className="text-muted">{quiz.quiz.description}</p>

          {quiz.questions.map((q, idx) => (
            <div key={q.id} className="mb-3">
              <strong>
                Q{idx + 1}. {q.question_text}
              </strong>

              {["a", "b", "c", "d"].map((opt) => (
                <div className="form-check" key={opt}>
                  <input
                    type="radio"
                    className="form-check-input"
                    checked={answers[q.id] === opt.toUpperCase()}
                    onChange={() => choose(q.id, opt.toUpperCase())}
                  />
                  <label className="form-check-label">
                    {q[`option_${opt}`]}
                  </label>
                </div>
              ))}
            </div>
          ))}

          <button className="btn btn-primary" onClick={submit}>
            Submit Quiz
          </button>

          {result && (
            <div className="alert alert-info mt-3">
              Score: {result.score} / {result.total}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TakeQuiz;
