import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';

import DefaultLayout from '@/layouts/DefaultLayout';

const AuthLayout = React.lazy(() => import('@/layouts/AuthLayout'));
const EntityLayout = React.lazy(() => import('@/layouts/EntityLayout'));

import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import CreateEntity from '@/pages/CreateEntity';
import JoinEntity from '@/pages/JoinEntity';
import EntityError from '@/pages/EntityError';

import InfoModalLayout from '@/layouts/InfoModalLayout';

const Home = React.lazy(() => import('@/pages/Home'));
const Settings = React.lazy(() => import('@/pages/Settings'));
const UserList = React.lazy(() => import('@/pages/Settings/UserList'));
const Teams = React.lazy(() => import('@/pages/Settings/Teams'));
const ConfigureRoles = React.lazy(() => import('@/pages/Settings/ConfigureRoles'));
const ProductList = React.lazy(() => import('@/pages/ProductList'));
const VendorList = React.lazy(() => import('@/pages/VendorList'));
const ProductInfo = React.lazy(() => import('@/pages/ProductList/[ProductInfo]'));
const VendorInfo = React.lazy(() => import('@/pages/VendorList/[VendorInfo]'));
const ProjectList = React.lazy(() => import('@/pages/ProjectList'));
const PurchaseRequisition = React.lazy(() => import('@/pages/PurchaseRequisition'));

export const Router = () => {
  return (
    <BrowserRouter basename={import.meta.env.DEV ? '/' : '/luna-eprocurement-system/'}>
      <InfoModalLayout>
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
              <Suspense>
                <AuthLayout>
                  <SignIn />
                </AuthLayout>
              </Suspense>
            }
          />
          <Route
            path="/sign-up"
            element={
              <Suspense>
                <AuthLayout>
                  <SignUp />
                </AuthLayout>
              </Suspense>
            }
          />
          <Route
            path="/create-entity"
            element={
              <Suspense>
                <EntityLayout>
                  <CreateEntity />
                </EntityLayout>
              </Suspense>
            }
          />
          <Route
            path="/join-entity"
            element={
              <Suspense>
                <EntityLayout>
                  <JoinEntity />
                </EntityLayout>
              </Suspense>
            }
          />
          <Route
            path="/purchase-requisition"
            element={
              <DefaultLayout>
                <PurchaseRequisition />
              </DefaultLayout>
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
      </InfoModalLayout>
    </BrowserRouter>
  );
};
