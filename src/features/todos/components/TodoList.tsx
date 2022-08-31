import type { FC } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { remove, update, restore } from '../todosSlice';
import type { Todo } from '../types'
import { useConfirmModal } from './modals/ConfirmModal/useConfirmModal';

type Props = {
  todos: Todo[];
};

export const TodoList: FC<Props> = ({todos}) => {
  const dispatch = useAppDispatch();
  const {
    open: openConfirmModal,
    setMessage,
    ConfirmModalWrapper,
  } = useConfirmModal();

  return (
    <>
    <ConfirmModalWrapper />
      <table border={1}>
        <thead>
          <tr>
            <th>id</th>
            <th>タイトル</th>
            <th>本文</th>
            <th>ステータス</th>
            <th>作成日時</th>
            <th>更新日時</th>
            <th>削除日時</th>
            <th>更新ボタン</th>
            <th>削除ボタン</th>
          </tr>
        </thead>
        <tbody>
          {todos.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ textAlign: 'center' }}>
                データなし
              </td>
            </tr>
          ) : (
            todos.map((todo) => {
              return (
                <tr key={todo.id}>
                  <td>{todo.id}</td>
                  <td>{todo.title}</td>
                  <td>{todo.body}</td>
                  <td>{todo.status}</td>
                  <td>{todo.createdAt}</td>
                  <td>{todo.updatedAt ?? '無し'}</td>
                  <td>{todo.deletedAt ?? '無し'}</td>
                  <td>
                    <button
                      disabled={isDeletedTodo(todo)}
                      onClick={() => {
                        //TODO: 更新機能の実装
                        dispatch(update({
                          id: todo.id,
                          input: {
                            title: '更新したタイトル' + Date.now(),
                            body: '更新したボディ' + Date.now(),
                            status: 'completed',
                          },

                        }
                          
                          ));
                      }}
                    >
                      更新
                    </button>
                  </td>

                  <td>
                    {isDeletedTodo(todo)? 
                    (
                    <button
                      onClick={() => {
                        setMessage('復元しますか？');
                        openConfirmModal(() => dispatch(restore(todo.id)));
                      }}
                    >
                      復元
                    </button>
                  ) : (
                    <button
                    onClick={() => {
                      setMessage('本当に削除しますか？');
                      openConfirmModal(() => dispatch(remove(todo.id)));
                  }}
                >
                  削除
                </button>
                  )}                  
                  </td>
                </tr>
              );
           })
         )}
        </tbody>
      </table>
    </>
  );
};

const isDeletedTodo = (todo: Todo) => {
  return todo.deletedAt !== undefined;
};

export default TodoList;