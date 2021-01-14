$(document).ready(function() {

    var nome_usuario, nome_repositorio;

    var repositorio;
    var repositorios;
    var dt_repositorios;

    var contribuidor;
    var contribuidores;
    var dt_contribuidores;

    var issue;
    var issues;
    var dt_issues;

    var comentarios;

    var modal = $("#exampleModal");

    $("#btn_pesquisar_repositorios").click(function(e) {
        e.preventDefault();
        nome_usuario = $("#nome_usuario").val();
        nome_repositorio = $("#nome_repositorio").val();
        $.ajax({
            dataType: "json",
            url: "https://api.github.com/users/" + nome_usuario + "/repos",
            success: function(dados) {
                if (dados) {
                    repositorios = dados;
                    //$("tbody").html('');
                    if (dt_repositorios) {
                        dt_repositorios.destroy();
                    }
                    dt_repositorios = $('#tabela_repositorios').DataTable({
                        "language": {
                            "url": "/js/js_tabela_pt_br.json"
                        },
                        data: repositorios,
                        responsive: true,
                        'columns': [{
                                data: 'id'
                            },
                            {
                                data: 'name'
                            },
                            {
                                data: null,
                                render: function(data, type, row) {
                                    return '<button class="btn btn-primary btn_selecionar_repositorio" value="' + data.id + '">Selecionar</button>';
                                }
                            }
                        ]
                    });
                } else {
                    dt_repositorios.destroy();
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                dt_repositorios.clear().draw();
                if (xhr.status == 404) {
                    Swal.fire(
                        'Erro!',
                        "Não há nenhum usuário com o nome: '" + nome_usuario + "'...",
                        'error'
                    ).then(function() {
                        return;
                    });
                }
                console.log(thrownError);
            }
        });
    });


    $('#tabela_repositorios tbody').on('click', 'tr button.btn_selecionar_repositorio', function() {
        tr = $(this).closest('tr');

        row = dt_repositorios.row(tr);

        repositorio = row.data();

        if (repositorio.has_issues) {
            $.ajax({
                dataType: "json",
                url: repositorio.url + "/issues",
                success: function(dados) {
                    if (dados) {

                        $("#iss").html("issues do repositorio " + repositorio.name);

                        if (dt_issues) {
                            dt_issues.destroy();
                        }

                        issues = dados;

                        console.log(issues);

                        dt_issues = $('#tabela_issues').DataTable({
                            "language": {
                                "url": "/js/js_tabela_pt_br.json"
                            },
                            data: issues,
                            responsive: true,
                            'columns': [{
                                    data: 'id'
                                },
                                {
                                    data: 'title'
                                },
                                {
                                    data: "closed_at",
                                    render: function(data, type, row) {
                                        if (data == null) {
                                            return '<span class="label label-success">Ativa</span>';
                                        } else {
                                            return '<span class="label label-danger">Inativa</span>';
                                        }
                                    }
                                },
                                {
                                    data: null,
                                    render: function(data, type, row) {
                                        return '<button class="btn btn-primary btn_selecionar_issue" value="' + data.id + '">Visualizar Issue</button>';
                                    }
                                },
                            ]
                        });
                    } else {
                        dt_issues.destroy();
                    }
                },
                error: function(erro) {
                    dt_issues.clear().draw();
                    console.log(erro);
                }
            });
        } else {
            Swal.fire(
                'Erro!',
                "Este repositório não possui nenhum issue...",
                'error'
            ).then(function() {
                return;
            });
        }

        $.ajax({
            dataType: "json",
            url: repositorio.contributors_url,
            success: function(dados) {

                if (dados) {

                    $("#contrib").html("Contribuidores do repositorio " + repositorio.name);

                    if (dt_contribuidores) {
                        dt_contribuidores.destroy();
                    }

                    contribuidores = dados;

                    dt_contribuidores = $('#tabela_contribuidores').DataTable({
                        "language": {
                            "url": "/js/js_tabela_pt_br.json"
                        },
                        data: contribuidores,
                        responsive: true,
                        'columns': [{
                                data: 'id'
                            },
                            {
                                data: "avatar_url",
                                render: function(data, type, row) {
                                    return '<img style="max-height:50px;max-width:50px" class="rounded-circle"  src="' + data + '"/>';
                                }

                            },
                            {
                                data: 'login'
                            },
                            {
                                data: 'contributions'
                            }
                        ]
                    });
                } else {
                    dt_contribuidores.destroy();
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                if (xhr.status == 404) {
                    Swal.fire(
                        'Erro!',
                        "Este repositório não possui nenhum contribuidor...",
                        'error'
                    ).then(function() {
                        return;
                    });
                }
                console.log(thrownError);
            }
        });


    });

    $('#tabela_issues tbody').on('click', 'tr button.btn_selecionar_issue', function() {
        tr = $(this).closest('tr');

        row = dt_issues.row(tr);

        issue = row.data();

        comentarios = '';

        $('#comentarios').html('')

        if (issue.comments > 0) {
            $.ajax({
                dataType: "json",
                type: 'GET',
                url: issue.comments_url,
                crossDomain: true,
                success: function(dados) {
                    $.each(dados, function(key, value) {
                        comentarios += "<div class='row form-group col-md-12'><label for='comentario_" + key + "' class='control-label'>" + value.user.login + "</label><input type='text' class='form-control' id='comentario_" + key + "' value='" + value.body + "' readonly></div>";
                    });
                    $('#comentarios').append(comentarios)
                }
            });
        } else {
            comentarios = "<div class='row form-group col-md-12'><p>Não há comentarios nesta issue...</p></div>"
            $('#comentarios').append(comentarios)
        }
        $("#descricao").html("<div class='row form-group col-md-12'><p>" + issue.body + "</p></div>")
        modal.modal('toggle');
    });

});