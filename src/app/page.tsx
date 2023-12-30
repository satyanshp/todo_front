"use client"; 
import styles from './page.module.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Icon } from '@iconify/react';

export default function Home() {
  const [tasks, setTasks] = useState<{ID:number,task:string,status:string}[]>([]);
  const [fetchData, setFetchData] = useState(false);
  useEffect(() => {
    const fetchData = async () =>{
      try {
        const {data: response} = await axios.get('https://todo-back-7wzv.onrender.com/api/v1/tasks');
        setTasks(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [fetchData])

  const initialValue = {
    task:"",
    status:"Pending"
  }
  const [values, setValues] = useState(initialValue);

  const [addTask, setAddTask] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const handleSubmit = async() => {
    await axios.post(
      `https://todo-back-7wzv.onrender.com/api/v1/tasks/create`,
      {
        task:values.task,
        status:values.status
      }
    );
    console.log("create",values);
    setAddTask(false);
    setEditMode(false);
    setFetchData(!fetchData);
  };
  const [getID, setGetID] = useState<undefined|number>();
  const openEdit = (index:number) => {
    setEditMode(true);
    setAddTask(true);
    setGetID(index);
    let data = tasks.find(x => x.ID === index)
    if(data)
    setValues({task:data.task, status:data.status});
  };
  const handleEditSave = async() => {
    console.log("update",values);
    await axios.patch(
      `https://todo-back-7wzv.onrender.com/api/v1/tasks/update`,
      {
        ID:getID,
        task:values.task,
        status:values.status
      }
    );
    setFetchData(!fetchData);
  };
  const handleDeleteSave = async(index:number) => {
    await axios.post(
      `https://todo-back-7wzv.onrender.com/api/v1/tasks/delete`,
      {
        ID:index
      }
    );
    setFetchData(!fetchData);
  };
  const handleColor = (type:string) => {
    console.log(type);
    if(type === "Pending"){
      return "pending";
    }
    else if(type === "InProgress"){
      return 'inProgress';
    }
    else{
      return 'completed';
    }
  }


  return (
    <main className={styles.main}>
      <header className={styles.center}>
        <code>
          Tasks Todo
        </code>
      </header>
      <button className={styles.button} onClick={()=>{setAddTask(true);setValues(initialValue);}}>+ Add Task</button>
      <section className={styles.grid}>
        {tasks?.map((item,index)=>(
          <div className={`${styles.card} ${handleColor(item.status)}`} key={`card-${index}`}>
            <div>
              <h2>
                {item.task}
              </h2>
              <Icon icon="tabler:edit" fontSize={24} color='#0096FF' style={{cursor:'pointer'}} onClick={()=>{openEdit(item.ID)}} />
            </div>
            <div>
              <p>{item.status}</p>
              <Icon icon="ic:outline-delete" style={{cursor:'pointer'}} color='#DC143C' fontSize={20} onClick={()=>{handleDeleteSave(index)}} />
            </div>
          </div>
        ))}
      </section>
      {addTask&&<section className={styles.modal}>
          <h2>Add Task</h2>
          <form>
            <div>
              <label htmlFor="task">Task</label>
              <input type="text" id='task' value={values.task} onChange={(e)=>{setValues({...values, task:e.target.value})}} />
            </div>
            <div>
              <label htmlFor="status">Status</label>
              <select id='status' value={values.status} onChange={(e)=>{setValues({...values, status:e.target.value})}}>
                <option value="Pending">Pending</option>
                <option value="Inprogress">Inprogress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <button style={{cursor:'pointer'}} onClick={editMode?handleEditSave:handleSubmit}>Submit</button>
            <div className={styles.close} onClick={()=>{setAddTask(false)}}>
              <Icon icon="ic:outline-close" fontSize={24} />
            </div>
          </form>
      </section>}
    </main>
  )
}
