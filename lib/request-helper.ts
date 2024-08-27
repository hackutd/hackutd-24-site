export class RequestHelper {
  /**
   * Will make a POST request to the provided URL with the provided config and body
   *
   * @param url URL to which the request will be made
   * @param config Config that can be added into the request, usually used to add information to the headers
   * @param body Request body
   * @returns Response data
   */
  static async post<ReqBody, ResBody>(
    url: string,
    config: RequestInit,
    body?: ReqBody,
  ): Promise<ResponseData<ResBody>> {
    const temp = await fetch(url, {
      ...config,
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(body),
    });
    const data = await temp.json();
    return {
      status: temp.status,
      data,
    };
  }

  /**
   * Will make a GET request to the provided URL with the provided config
   *
   * @param url URL to which the request will be made
   * @param config Config that can be added into the request, usually used to add information to the headers
   * @returns Response data
   */
  static async get<ResBody>(url: string, config: RequestInit): Promise<ResponseData<ResBody>> {
    const temp = await fetch(url, {
      ...config,
      method: 'GET',
      mode: 'cors',
    });
    const data = await temp.json();
    return {
      status: temp.status,
      data,
    };
  }

  /**
   * Will make a DELETE request to the provided URL with the provided config and body
   *
   * @param url URL to which the request will be made
   * @param config Config that can be added into the request, usually used to add information to the headers
   * @param body Request body
   * @returns Response data
   */
  static async delete<ReqBody, ResBody>(
    url: string,
    config: RequestInit,
    body?: ReqBody,
  ): Promise<ResponseData<ResBody>> {
    const temp = await fetch(url, {
      ...config,
      method: 'DELETE',
      mode: 'cors',
      body: JSON.stringify(body),
    });
    const data = await temp.json();
    return {
      status: temp.status,
      data,
    };
  }

  /**
   * Will make a PUT request to the provided URL with the provided config and body
   *
   * @param url URL to which the request will be made
   * @param config Config that can be added into the request, usually used to add information to the headers
   * @param body Request body
   * @returns Response data
   */
  static async put<ReqBody, ResBody>(
    url: string,
    config: RequestInit,
    body?: ReqBody,
  ): Promise<ResponseData<ResBody>> {
    const temp = await fetch(url, {
      ...config,
      method: 'PUT',
      mode: 'cors',
      body: JSON.stringify(body),
    });
    const data = await temp.json();
    return {
      status: temp.status,
      data,
    };
  }
}

/**
 * Represent response data object
 */
interface ResponseData<T> {
  /**
   * Status code of the request
   */
  status: number;

  /**
   * Data returned by the response
   */
  data: T;
}
