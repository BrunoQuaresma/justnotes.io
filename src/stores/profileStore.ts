import { createSlice, PayloadAction, createSelector } from 'redux-starter-kit'
import { Dispatch } from 'react'
import * as profileApi from 'apis/profileApi'

export type ProfileItem = {
  preferences?: {
    encrypted?: boolean
  }
}

type ProfileState = {
  data: ProfileItem
  isLoading: boolean
  error?: string
}

const initialState: ProfileState = {
  data: {
    preferences: undefined
  },
  error: undefined,
  isLoading: false
}

const profileSlice = createSlice({
  initialState,
  slice: 'profile',
  reducers: {
    fetchProfileStart: state => {
      state.isLoading = true
    },
    fetchProfileSuccess: (state, action) => {
      state.isLoading = false
      state.data = action.payload
    },
    fetchNotesError: (state, action) => {
      state.isLoading = false
      state.error = action.payload.error
    }
  }
})

const { actions, reducer } = profileSlice

/* Actions */

export const fetchProfile = () => async (
  dispatch: Dispatch<PayloadAction>
): Promise<ProfileItem | undefined> => {
  dispatch(actions.fetchProfileStart())

  try {
    const profileDocument = await profileApi.getProfile()
    const profile: ProfileItem = {
      preferences: profileDocument.data.preferences
    }
    dispatch(actions.fetchProfileSuccess(profile))
    return profile
  } catch (error) {
    dispatch(actions.fetchNotesError({ error }))
  }
}

/* Selectors */

export const selectProfile = createSelector(['profile.data'])
export const selectPreferences = createSelector(['profile.data.preferences'])
export const selectProfileLoading = createSelector(['profile.isLoadnig'])

export default reducer
