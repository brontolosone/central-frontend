/*
Copyright 2019 ODK Central Developers
See the NOTICE file at the top-level directory of this distribution and at
https://github.com/getodk/central-frontend/blob/master/NOTICE.

This file is part of ODK Central. It is subject to the license terms in
the LICENSE file found in the top-level directory of this distribution and at
https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
including this file, may be copied, modified, propagated, or distributed
except according to the terms contained in the LICENSE file.
*/
import VueRouter from 'vue-router';

// Returns the props for a route component.
export const routeProps = (route, props) => {
  if (props == null || props === false) return {};
  if (props === true) return route.params;
  if (typeof props === 'function') return props(route);
  // Object mode
  return props;
};

export const forceReplace = ({ router, unsavedChanges }, location) => {
  unsavedChanges.zero();
  return router.replace(location);
};



////////////////////////////////////////////////////////////////////////////////
// RESPONSE DATA

/*
preservesData() returns `true` if the data for `key` should not be cleared when
the route changes from `from` to `to`. Otherwise it returns `false`.

  - key. A request key or '*'.
  - to. A Route object.
  - from. A Route object.
*/
export const preservesData = (key, to, from) => {
  if (from === VueRouter.START_LOCATION) return true;
  const forKey = to.meta.preserveData[key];
  if (forKey == null) return false;
  const params = forKey[from.name];
  if (params == null) return false;
  return params.every(param => to.params[param] === from.params[param]);
};

/*
canRoute() returns `false` if response data exists that violates a validateData
condition specified for the `to` route. Otherwise it returns `true`.

  - to. A Route object.
  - from. A Route object.
  - store. The Vuex store.
*/
export const canRoute = (to, from, store) => {
  for (const [key, validator] of to.meta.validateData) {
    // If the data for the request key will be cleared after the navigation is
    // confirmed, we do not need to validate it.
    if (preservesData('*', to, from) || preservesData(key, to, from)) {
      const value = store.state.request.data[key];
      if (value != null && !validator(value)) return false;
    }
  }
  return true;
};
