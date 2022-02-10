import { FormEvent, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import '../styles/room.scss'


type RoomParams = {
    id: string;
}

export function AdminRoom() {

    //const {user} = useAuth();
    const params = useParams<RoomParams>();
    const history = useHistory();
    //const [newQuestion, setNewQuestion] = useState('');
    const roomId = params.id;
    const { title, questions } = useRoom(params.id);
    
    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })
        history.push('/');
    }

    async function handleDeleteQuestion(questionId: string){
        if (window.confirm('Tem certeza que vocẽ deseja excluir esta pergunta?')) {
            const questionRef = await database.ref(`rooms/${roomId}/question/${questionId}`).remove();
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} perguntas</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            >
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="Remover Pergunta" />
                                </button>
                            </Question>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}