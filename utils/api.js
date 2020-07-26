
import $ from "jquery";

export /**
 * @param {{ loading: boolean; }} state
 */
 const useApi = (state) => {
  /**
   * @param {any} url
   * @param {any} type
   */
  const api = (url, type) => {
    return new Promise((resolve, reject) => {
      state.loading = true;
      const req = $.ajax({
        url,
        type,
      });

      req.done((data) => {
        resolve(data);
      });

      req.fail((error) => {
        console.log(error);
        reject(error);
      });

      req.always(() => {
        state.loading = false;
      });
    });
  }
  return {
    api,
  }
}
