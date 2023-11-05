import ReactOnRails from 'react-on-rails';
import LoginForm from '../components/LoginForm';
import Register from '../components/Register';
import HomeUser from '../components/HomeUser';
import App from '../components/App';
import Header from '../components/Header';
import HomeAdmin from '../components/HomeAdmin';
import ManageUsers from '../components/ManageUser';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import PostDetail from '../components/PostDetail';
ReactOnRails.register({
  LoginForm,Register,HomeUser, App, Header,HomeAdmin, ManageUsers,PostForm, PostList,PostDetail
});
