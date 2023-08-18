import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AuthLayout from '@/layouts/AuthLayout';
import DefaultLayout from '@/layouts/DefaultLayout';
import EntityLayout from '@/layouts/EntityLayout';

import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import CreateEntity from '@/pages/CreateEntity';
import JoinEntity from '@/pages/JoinEntity';
import Home from '@/pages/Home';
import Settings from '@/pages/Settings';
import UserList from '@/pages/Settings/UserList';
import Teams from '@/pages/Settings/Teams';
import EntityError from '@/pages/EntityError';
import ConfigureRoles from '@/pages/Settings/ConfigureRoles';
import ProductList from '@/pages/ProductList';
import VendorList from '@/pages/VendorList';
import ProductInfo from '@/pages/ProductList/[ProductInfo]';
import VendorInfo from '@/pages/VendorList/[VendorInfo]';
import ProjectList from '@/pages/ProjectList';

export const Router = () => {
  return (
    <BrowserRouter basename={import.meta.env.DEV ? '/' : '/lunar-eprocurement-system/'}>
      <Routes>
        <Route
          path="/"
          element={
            <DefaultLayout>
              <Home />
            </DefaultLayout>
          }
        />
        <Route
          path="/sign-in"
          element={
            <AuthLayout>
              <SignIn />
            </AuthLayout>
          }
        />
        <Route
          path="/sign-up"
          element={
            <AuthLayout>
              <SignUp />
            </AuthLayout>
          }
        />
        <Route
          path="/create-entity"
          element={
            <EntityLayout>
              <CreateEntity />
            </EntityLayout>
          }
        />
        <Route
          path="/join-entity"
          element={
            <EntityLayout>
              <JoinEntity />
            </EntityLayout>
          }
        />
        <Route
          path="/projects"
          element={
            <DefaultLayout>
              <ProjectList />
            </DefaultLayout>
          }
        />
        <Route
          path="/products"
          element={
            <DefaultLayout>
              <ProductList />
            </DefaultLayout>
          }
        />
        <Route
          path="/products/:productCode"
          element={
            <DefaultLayout>
              <ProductInfo />
            </DefaultLayout>
          }
        />
        <Route
          path="/vendors"
          element={
            <DefaultLayout>
              <VendorList />
            </DefaultLayout>
          }
        />
        <Route
          path="/vendors/:vendorCode"
          element={
            <DefaultLayout>
              <VendorInfo />
            </DefaultLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <DefaultLayout>
              <Settings />
            </DefaultLayout>
          }
        >
          <Route path="user-list" element={<UserList />} />
          <Route path="teams" element={<Teams />} />
          <Route path="roles-config" element={<ConfigureRoles />} />
        </Route>
        <Route
          path="/NaN"
          element={
            <DefaultLayout>
              <EntityError />
            </DefaultLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
