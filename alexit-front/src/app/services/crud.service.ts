import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../models/category.model';
import { Courier } from '../../models/courier.model';
import { Order } from '../../models/order.model';
import { Product } from '../../models/product.model';
import { User } from '../../models/user.model';
import { apiUrls } from '../../middlewares/api.urls';
import { Blog } from '../../models/blog.model';
import { Offer } from '../../models/offer.model';


@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(private http: HttpClient) { }




  anyFileDelete(filePath: string) {
    return this.http.delete(apiUrls.anyFileDeleteApi, { body: { filePath: filePath } });
  }



  // Kategorije
  categoriesGet() {
    return this.http.get<any>(apiUrls.categoryApi);
  }

  categoryPost(category: Category) {
    return this.http.post(`${apiUrls.categoryApi}add`, category);
  }

  categoryImageUpload(file: FormData) {
    return this.http.post(`${apiUrls.categoryApi}upload-image`, file);
  }

  categoryPut(category: any) {
    return this.http.put(`${apiUrls.categoryApi}update/${category._id}`, category);
  }

  categoryDelete(id: string, imagePath: string) {
    return this.http.delete(`${apiUrls.categoryApi}delete/${id}`, { body: { imagePath: imagePath } });
  }
  categoryGet(id: string) {
    return this.http.get<any>(apiUrls.categoryApi + id);
  }


  // Proizvodi
  productsGet() {
    return this.http.get<any>(apiUrls.productApi);
  }
  productPost(product: Product) {
    return this.http.post(`${apiUrls.productApi}add`, product);
  }
  productDelete(id: string) {
    return this.http.delete(`${apiUrls.productApi}delete/${id}`);
  }
  productPut(product: Product) {
    return this.http.put(`${apiUrls.productApi}update/${product._id}`, product)
  }
  productImagesUpload(formdata: FormData) {
    return this.http.post(`${apiUrls.productApi}upload-image`, formdata);
  }


  // Users.
  usersGet() {
    return this.http.get<any>(apiUrls.userApi, { withCredentials: true });
  }
  userGet(id: string) {
    return this.http.get<any>(apiUrls.userApi + id, { withCredentials: true });
  }
  userPost(user: User) {
    return this.http.post(`${apiUrls.authApi}register`, user);
  }
  userDelete(id: string) {
    return this.http.delete(`${apiUrls.userApi}delete/${id}`, { withCredentials: true });
  }
  userPut(user: User) {
    return this.http.put(`${apiUrls.userApi}update/${user._id}`, user, { withCredentials: true });
  }

  // Orders
  ordersGet() {
    return this.http.get<any>(apiUrls.orderApi);
  }
  orderPost(order: Order) {
    return this.http.post(`${apiUrls.orderApi}add`, order);
  }
  orderDelete(id: string) {
    return this.http.delete(`${apiUrls.orderApi}delete/${id}`);
  }
  orderPut(order: Order) {
    return this.http.put(`${apiUrls.orderApi}update/${order._id}`, order);
  }

  orderMailPost(mailObj: any) {
    return this.http.post(apiUrls.orderApi + 'send-status-email', mailObj);
  }
  accountingPost(orderId: string, accounting: string) {
    return this.http.post(apiUrls.orderApi + 'send-accounting', { orderId: orderId, accounting: accounting });
  }

  // Couriers
  couriersGet() {
    return this.http.get<any>(apiUrls.courierApi);
  }
  courierPost(courier: Courier) {
    return this.http.post(`${apiUrls.courierApi}add`, courier);
  }
  courierDelete(id: string) {
    return this.http.delete(`${apiUrls.courierApi}delete/${id}`);
  }


  salesGet() {
    return this.http.get<any>(apiUrls.salesApi);
  }
  salesPost(sale: any) {
    return this.http.post(apiUrls.salesApi + 'add', sale);
  }

  pageViewsGet() {
    return this.http.get<any>(apiUrls.pageViews);
  }
  pageViewsPut(pageView: number) {
    return this.http.put(apiUrls.pageViewsUpdate, { views: pageView });
  }

  // --- NEWSLETTER ---
  subscribersGet() {
    return this.http.get<any>(apiUrls.newsletterApi);
  }

  subscriberPost(email: string) {
    return this.http.post(apiUrls.newsletterApi + 'add-subscriber', { email: email });
  }

  newsPost(news: { newsType: string, email: string, content: string, image: string }) {
    return this.http.post(apiUrls.newsletterApi + 'send-news', news);
  }





  // ---contact message ---
  sendContactMessage(user: { name: string, email: string, message: string, portfolio: string }) {
    return this.http.post<any>(apiUrls.contactApi, user);
  }





  // ======================== BLOGS ==============================
  blogTopicsGet() {
    return this.http.get<any>(apiUrls.blogTopicApi);
  }
  blogTopicPost(name: string) {
    return this.http.post(apiUrls.blogTopicApi + 'add', { name: name });
  }

  //--Blogs
  blogsGet() {
    return this.http.get<any>(apiUrls.blogApi);
  }

  blogGet(id: string) {
    return this.http.get<any>(apiUrls.blogApi + id);
  }

  blogPost(blog: Blog) {
    console.log(blog.content)
    return this.http.post(apiUrls.blogApi + 'create', blog);
  }

  blogPut(blog: Blog) {
    return this.http.put(apiUrls.blogApi + 'update/' + blog._id, blog);
  }

  blogDelete(id: string) {
    return this.http.delete(apiUrls.blogApi + 'delete/' + id);
  }

  blogUploadFeaturedImage(file: FormData) {
    return this.http.post(apiUrls.blogApi + 'upload-featured', file);
  }

  blogUploadSingleImage(file: FormData) {
    return this.http.post(apiUrls.blogApi + 'upload-single', file);
  }

  blogUploadGallery(formdata: FormData) {
    return this.http.post(apiUrls.blogApi + 'upload-gallery', formdata);
  }







  // =============================== OFFERS ======================================
  offerCategoriesGet() {
    return this.http.get<any>(apiUrls.offerCategoryApi);
  }
  offerCategoryPost(name: string) {
    return this.http.post(apiUrls.offerCategoryApi + 'add', { name: name });
  }



  offersGet() {
    return this.http.get<any>(apiUrls.offerApi);
  }
  offerGet(id: string) {
    return this.http.get<any>(apiUrls.offerApi + id);
  }
  offerPost(offer: Offer) {
    return this.http.post(apiUrls.offerApi + 'create', offer);
  }

  offerPut(offer: Offer) {
    return this.http.put(apiUrls.offerApi + 'update/' + offer._id, offer);
  }

  offerDelete(id: string) {
    return this.http.delete(apiUrls.offerApi + 'delete/' + id);
  }

  offerUploadFeaturedImage(file: FormData) {
    return this.http.post(apiUrls.offerApi + 'upload-featured', file);
  }





}
