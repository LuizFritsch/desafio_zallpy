$(document).ready(function() {

    var nome_usuario, nome_repositorio;

    var repositorio;
    var repositorios;
    var dt_repositorios;

    var contribuidor;
    var contribuidores;
    var dt_contribuidores;

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

        /**console.log('-------------');
        console.log(repositorio);
        console.log('-------------');

        console.log('issuesissuesissuesissuesissuesissuesissuesissues');
        console.log(repositorio.has_issues);
        console.log('issuesissuesissuesissuesissuesissuesissuesissues');
**/

        if (repositorio.has_issues) {
            $.ajax({
                dataType: "json",
                url: repositorio.url + "/issues",
                success: function(dados) {
                    console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDD");
                    console.log(dados);
                    console.log("DDDDDDDDDDDDDDDDDDDDDDDDDDDD");
                },
                error: function(erro) {
                    dt_contribuidores.clear().draw();
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
                    /**
                     * console.log('%%%%%%%%%%');
                     * console.log(dados);
                     * console.log('%%%%%%%%%%');
                     */
                    contribuidores = dados;
                    //$("#tabela_contribuidores").html("");

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

        ///repos/{owner}/{repo}/issues

    });




});