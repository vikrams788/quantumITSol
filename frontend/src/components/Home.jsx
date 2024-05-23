import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import userData from '../assets/data.json';
import './home.css'
import { FaUser, FaUserShield } from "react-icons/fa";
import { GrUserAdmin } from "react-icons/gr";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [users, setUsers] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const navigate = useNavigate();

  const usersPerPage = 5;
  const pagesVisited = pageNumber * usersPerPage;

  useEffect(() => {
    setUsers(userData);
  }, []);

  const pageCount = Math.ceil(users.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleLogout = async () => {
    try {
        const response = await axios.get('http://localhost:4000/api/logout', {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
            }
        });

        console.log(response.data);
        localStorage.clear();
        navigate('/login')
    } catch (error) {
        console.log("Error logging out: ", error);
    }
  }

  const displayUsers = users
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .map(user => (
      <tr key={user.userId}>
        <td>{user.userId}</td>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>
          <span
            className={`status-dot ${user.status.toLowerCase()}`}
            aria-label={user.status === "Active" ? "Active status" : "Inactive status"}
          ></span>
          {user.status}
        </td>
        <td className='d-flex align-items-center hover'>
            {user.role === 'User' && <FaUser className='mx-2' size={20}/>}
            {user.role === 'Admin' && <GrUserAdmin className='mx-2' size={20}/>}
            {user.role === 'Moderator' && <FaUserShield className='mx-2' size={20}/>}
            {user.role}
        </td>
      </tr>
    ));

  return (
    <div className="d-flex justify-content-center pt-5 vh-100 bg-light">
      <div className="container">
        <h2 className="text-center mb-4">User List</h2>
        <button className="btn btn-danger my-2" onClick={handleLogout}>Logout</button>
        <table className="table table-striped table-bordered">
          <thead className=" bg-primary text-white ">
            <tr>
              <th scope="col">User ID</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Status</th>
              <th scope="col">Role</th>
            </tr>
          </thead>
          <tbody>
            {displayUsers}
          </tbody>
        </table>
        <div className="d-flex justify-content-center">
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"pagination"}
            previousLinkClassName={"page-link"}
            nextLinkClassName={"page-link"}
            disabledClassName={"disabled"}
            activeClassName={"active"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;