export default {
    message: {
        success: {
            created: {
                vn: 'Thêm thành công',
                en: 'Created successful'
            },
            updated: {
                vn: 'Cập nhật thành công',
                en: 'Updated successful'
            },
            deleted: {
                vn: 'Xóa thành công',
                en: 'Delete successful'
            },
            loged: {
                vn: 'Đăng nhập thành công',
                en: 'Login success'
            }
        },
        error: {
            created_failed: {
                vn: 'Thêm không thành công',
                en: 'Created failed'
            },
            updated_failed: {
                vn: 'Cập nhật không thành công',
                en: 'Updated failed'
            },
            deleted_failed: {
                vn: 'Xóa không thành công',
                en: 'Delete failed'
            },
            deleted: {
                vn: 'Đã bị xóa',
                en: 'Deleted'
            },
            unauthorized: {
                vn: 'Không có quyền thực hiện thao tác',
                en: 'Not authorized'
            },
            server: {
                vn: 'Máy chủ không phản hồi',
                en: 'Internal Server Error'
            },
            method: {
                vn: 'Phương thức không được hỗ trợ',
                en: 'Method not supported'
            },
            validation: {
                exist: {
                    vn: 'Đã tồn tại',
                    en: 'Already exist'
                },
                required: {
                    vn: 'Không được để trống',
                    en: 'Not be empty'
                },
                format: {
                    vn: 'Không đúng định dạng',
                    en: 'Incorrect format'
                },
                incorrect: {
                    vn: 'Không chính xác',
                    en: 'Incorrect'
                },
                not_exist: {
                    vn: 'Không tồn tại',
                    en: 'Not exist'
                },
            },
            upload_failed: {
                vn: 'Upload không thành công',
                en: 'Upload failed'
            },
            header_not_acepted: {
                vn: 'Header không được chấp nhận',
                en: 'Header not acepted'
            },
            tokenError: {
                vn: 'Token sai định dạng',
                en: 'Something wrong with token'
            },
            tokenExpired: {
                vn: 'Token hết hạn',
                en: 'Token expried'
            }
        },
    },
    resources: {
        front: {
            vn: 'Bề mặt',
            en: 'Surface'
        },
        frontName: {
            vn: 'Tên bề mặt',
            en: 'Surface name'
        },
        size: {
            vn: 'Kích thước',
            en: 'Size'
        },
        width: {
            vn: 'Chiều rộng',
            en: 'Width'
        },
        height: {
            vn: 'Chiều dài',
            en: 'Height'
        },
        room: {
            vn: 'Không gian',
            en: 'Room'
        },
        roomName: {
            vn: 'Tên không gian',
            en: 'Room name'
        },
        roomId: {
            vn: 'Id không gian',
            en: 'Room Id'
        },
        layout: {
            vn: 'Kiểu bố trí',
            en: 'Layout'
        },
        layoutName: {
            vn: 'Tên kiểu bố trí',
            en: 'Layout name'
        },
        layoutImage: {
            vn: 'Ảnh kiểu bố trí',
            en: 'Layout image'
        },
        product: {
            vn: 'Sản phẩm',
            en: 'Product'
        },
        productName: {
            vn: 'Tên sản phẩm',
            en: 'Product name'
        },
        productCode: {
            vn: 'Mã sản phẩm',
            en: 'Product code'
        },
        productImage: {
            vn: 'Ảnh sản phẩm',
            en: 'Product image'
        },
        outSize: {
            vn: 'Loại sản phẩm',
            en: 'Product type'
        },
        username: {
            vn: 'Tên đăng nhập',
            en: 'Username'
        },
        password: {
            vn: 'Mật khẩu',
            en: 'Password'
        },
        usernameOrPassword: {
            vn: 'Tên đăng nhập hoặc mật khẩu',
            en: 'Username or password'
        },
        newPassword: {
            vn: 'Mật khẩu mới',
            en: 'New password'
        },
    }
}
export const langConcat = (l1, l2) => ({ vn: l1?.vn + " " + l2?.vn.toLowerCase(), en: l1?.en + " " + l2?.en.toLowerCase() })