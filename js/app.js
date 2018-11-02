Vue.component('main-header', {
    template: '#tpl-main-header'
})
Vue.component('main-sidebar', {
    template: '#tpl-main-sidebar'
})
Vue.component('main-footer', {
    template: '#tpl-main-footer'
})
Vue.component('control-sidebar', {
    template: '#tpl-control-sidebar'
})

const routes = []

//首页
Vue.component('page-home', {
    template: '#tpl-page-home',
    mounted: function () {
        this.$root.ajax(this, 'get', 'user/profile', {}, function (data) {
            //todo
            console.log(data)
        })
    }
})
routes.push({path: '/', component: {template: '<page-home></page-home>'}})

//登录页
Vue.component('page-login', {
    template: '#tpl-page-login',
    data: function () {
        return {
            'user': {username: '', password: '', remember: false}
        }
    },
    methods: {
        login: function () {
            this.$root.ajax(this, 'get', 'auth/token', this.user, function (data) {
                this.$root.login(data)
                this.$root.$router.push('/')
            })
        },
    }
})
routes.push({path: '/login', component: {template: '<page-login></page-login>'}})


//机器管理
Vue.component('page-machine', {
    template: '#tpl-page-machine',
    data: function () {
        return {
            items: [
                // {'id': 1, 'name': 'test'},
                // {'id': 2, 'name': 'test2'},
            ]
        }
    },
    mounted: function () {
        this.init()
    },

    methods: {
        init: function () {
            this.$root.ajax(this, 'get', 'machine', {}, function (data) {
                this.items = data
            })
        },
        del: function (e) {

            if (!confirm('确定要删除吗?')) {
                return
            }

            id = e.target.dataset.id

            this.$root.ajax(this, 'get', 'machine/delete', {id: id}, function (data) {
                this.init()
            })
        },
        test: function (e) {
            id = e.target.dataset.id

            this.$root.ajax(this, 'get', 'machine/test', {id: id}, function (data) {
                leaf.toast("测试成功", 1000)
            })

        },
    }
})
Vue.component('page-machine-create', {
    template: '#tpl-page-machine-create',
    data: function () {
        return {
            model: {
                'name': '',
                'ip': '',
                'user': 'root',
                'password': ''
            }
        }
    },
    methods: {
        save: function () {

            this.$root.ajax(this, 'post', 'machine/create', this.model, function () {
                this.$router.push('/machine')
            })


        }
    }
})
routes.push({path: '/machine', component: {template: '<page-machine></page-machine>'}})
routes.push({path: '/machine/create', component: {template: '<page-machine-create></page-machine-create>'}})


//项目管理
Vue.component('page-project', {
    template: '#tpl-page-project',
    data: function () {
        return {
            items: [],
            machines: [],
        }
    },
    mounted: function () {
        this.init()
    },

    methods: {
        init: function () {

            this.$root.ajax(this, 'get', 'project', {}, function (data) {
                this.items = data

            })

        },
        del: function (e) {

            if (!confirm('确定要删除吗?')) {
                return
            }

            id = e.target.dataset.id

            this.$root.ajax(this, 'get', 'project/delete', {id: id}, function () {
                this.init()
            })
        },
    }
})
Vue.component('page-project-create', {
    template: '#tpl-page-project-create',
    data: function () {
        return {
            model: {
                'name': '',
                'repository': '',
                'machine_ids': '',
                'directory': '',
                'pre_deploy': '',
                'post_release': '',
            },
            //所有机器数据
            machines: [],
            //选中的机器id
            ids: [],
        }
    },
    mounted: function () {

        this.$root.ajax(this, 'get', 'machine', this.model, function (data) {
            this.machines = data
        })

    },
    methods: {
        change: function (e) {
            //当前的机器id
            var machine_id = parseInt(e.target.dataset.id)

            //如果是选中，则添加进去
            if (e.target.checked) {
                this.ids.push(machine_id)
            } else {
                this.ids = this.ids.filter(function (one) {
                    return one != machine_id
                })
            }

            this.model.machine_ids = JSON.stringify(this.ids)
        },

        save: function () {
            this.$root.ajax(this, 'post', 'project/create', this.model, function () {
                this.$router.push('/project')
            })
        }

    }
})
routes.push({path: '/project', component: {template: '<page-project></page-project>'}})
routes.push({path: '/project/create', component: {template: '<page-project-create></page-project-create>'}})


//任务管理
Vue.component('page-task', {
    template: '#tpl-page-task',
    data: function () {
        return {
            items: [
                // {'id': 1, 'name': 'test'},
                // {'id': 2, 'name': 'test2'},
            ]
        }
    },
    mounted: function () {
        this.init()
    },

    methods: {
        init: function () {
            this.$root.ajax(this, 'get', 'task', {}, function (data) {
                this.items = data
            })
        },
        del: function (e) {

            if (!confirm('确定要删除吗?')) {
                return
            }

            id = e.target.dataset.id

            this.$root.ajax(this, 'get', 'task/delete', {id: id}, function () {
                this.init()
            })
        },
        status_str: function (val) {
            var map = {1: '未处理', 2: "已处理"}
            return map[val]
        },
        deploy:function(e){

            id = e.target.dataset.id

            var _this = this
            this.$root.ajax(this, 'post', 'task/deploy', {id: id}, function () {
                leaf.toast("操作成功", 1000,function(){
                    _this.init()
                })
            })
        }
    }
})
Vue.component('page-task-create', {
    template: '#tpl-page-task-create',
    data: function () {
        return {
            model: {
                'branch': 'master',
            },
            projects: [],
        }
    },
    mounted: function () {

        this.$root.ajax(this, 'get', 'project', {}, function (data) {
            this.projects = data
        })
    },
    methods: {
        save: function () {

            this.$root.ajax(this, 'post', 'task/create', this.model, function () {
                this.$router.push('/task')
            })
        }
    }
})
routes.push({path: '/task', component: {template: '<page-task></page-task>'}})
routes.push({path: '/task/create', component: {template: '<page-task-create></page-task-create>'}})


const app = new Vue({
    router: new VueRouter({
        routes: routes
    }),
    data: {
        isLogin: false
    },
    mounted: function () {
        this.isLogin = !!this.token()
    },
    computed: {},
    methods: {
        baseUrl: function () {
            return 'http://127.0.0.1:5000/'
        },
        apiUrl: function (api) {
            return this.baseUrl() + api + "?token=" + this.token()
        },
        token: function () {
            var token = window.localStorage.getItem('token')
            if (token) {
                return token
            }
            return ''
        },
        login: function (data) {
            window.localStorage.setItem('token', data.token)
            this.isLogin = true
        },
        logout: function () {
            window.localStorage.removeItem('token')
            this.isLogin = false
            this.$router.push('/login')
        },
        ajax: function (obj, method, api, data, success, fail) {
            var _this = this
            var loading = leaf.loading().start()

            $.ajax({
                type: method,
                url: _this.apiUrl(api),
                data: data || {},
                dataType: "json",
                success: function (result) {

                    loading.stop()

                    if (result.status) {
                        if (success) {
                            success.call(obj, result.data, result.code)
                        }
                    } else {

                        if (fail) {
                            fail.call(obj, result.data, result.code)
                        } else {
                            if (result.code === "INVALID_TOKEN" || result.data === "INVALID_TOKEN") {
                                _this.isLogin = false
                                _this.$router.push("/login")
                            } else {
                                leaf.alert(result.data ? result.data : '出错了1')
                            }
                        }
                    }
                },
                error: function () {
                    loading.stop()
                    leaf.alert("出错了2")
                }
            })
        }
    }
}).$mount('#app')
