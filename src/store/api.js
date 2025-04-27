import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.user?.token || localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ['User', 'Review'],
  endpoints: (builder) => ({
    // Пользователи
    getUsers: builder.query({
      query: () => '/users',
      providesTags: ['User']
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials
      }),
      invalidatesTags: ['User']
    }),
    registerUser: builder.mutation({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData
      }),
      invalidatesTags: ['User']
    }),
    updateUser: builder.mutation({
      query: ({ userId, ...userData }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body: userData
      }),
      invalidatesTags: ['User']
    }),
    blockUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}/block`,
        method: 'PUT'
      }),
      invalidatesTags: ['User']
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['User']
    }),

    // Отзывы
    getReviews: builder.query({
      query: () => '/reviews',
      providesTags: ['Review']
    }),
    addReview: builder.mutation({
      query: (reviewData) => ({
        url: '/reviews',
        method: 'POST',
        body: reviewData
      }),
      invalidatesTags: ['Review']
    }),
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: 'DELETE',
        
      }),
      invalidatesTags: ['Review']
    }),
    blockReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}/block`,
        method: 'PUT'
      }),
      invalidatesTags: ['Review']
    })
  })
});

export const {
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
  useUpdateUserMutation,
  useBlockUserMutation,
  useDeleteUserMutation,
  useGetReviewsQuery,
  useLazyGetReviewsQuery,
  useAddReviewMutation,
  useDeleteReviewMutation,
  useBlockReviewMutation
} = api;